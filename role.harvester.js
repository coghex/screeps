var roleHarvester = {
    run: function(creep) {
        var arr = [];
        for (const i in Game.creeps) {
            arr.push(Game.creeps[i].memory.job);
        }
        var nharv = arr.filter(j => (j == "harv")).length;
        var nupgd = arr.filter(j => (j == "upgd")).length;
        var nbldr = arr.filter(j => (j == "bldr")).length;
        var nrepr = arr.filter(j => (j == "repr")).length;
        if (arr.length) {
            //console.log("nharv: " + nharv + ". nupgd: " + nupgd + ", nbldr: " + nbldr);
            var powerscore = creep.room.energyCapacityAvailable - creep.room.energyAvailable;
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            var buildscore = targets.length;
            var reprtargets = creep.room.find(FIND_STRUCTURES, {
                filter: object => object.hits < object.hitsMax
            });
            var nreprtargets = reprtargets.length
            var ncreeps = arr.length;
            var div = Memory.level;
            var bldrscore = 100-((40*nbldr)/div);
            var upgdscore = 100-((45*nupgd)/div);
            var harvscore = 100-((30*nharv)/div);
            var reprscore = 100-((50*nrepr)/div);
            if ((powerscore < 40)) {
                harvscore -= 40;
            }
            else {
                harvscore += 20;
                upgdscore -= 20;
            }
            if (buildscore < 1) {
                buildscore -= 40;
                upgdscore += 10;
            }
            if (nreprtargets > 1) {
                reprscore += 10;
            }
            else {
                reprscore -= 40;
            }
            //console.log("harvscore: " + harvscore + ". upgdscore: " + upgdscore + ", bldrscore: " + bldrscore);

            var maxscore = Math.max([bldrscore, upgdscore, harvscore, reprscore]);
            var util = creep.memory.utility + 12;
            if ((util < harvscore) || (util < bldrscore) || (util < upgdscore) || (util < reprscore)) {
                if (harvscore > bldrscore) {
                    if (harvscore > upgdscore) {
                        if (harvscore > reprscore) {
                            creep.memory.job = "harv";
                            creep.memory.utility = harvscore+12;
                        }
                        else {
                            creep.memory.job = "repr";
                            creep.memory.utility = reprscore+12;
                        }
                    }
                    else {
                        if (upgdscore > reprscore) {
                            creep.memory.job = "upgd";
                            creep.memory.utility = upgdscore+12;
                        }
                        else {
                            creep.memory.job = "repr";
                            creep.memory.utility = reprscore+12;
                        }
                    }
                }
                else {
                    if (bldrscore > upgdscore) {
                        if (bldrscore > reprscore) {
                            creep.memory.job = "bldr";
                            creep.memory.utility = bldrscore+12;
                        }
                        else {
                            creep.memory.job = "repr";
                            creep.memory.utility = reprscore+12;
                        }
                    }
                    else {
                        if (upgdscore > reprscore) {
                            creep.memory.job = "upgd";
                            creep.memory.utility = upgdscore+12;
                        }
                        else {
                            creep.memory.job = "repr";
                            creep.memory.utility = reprscore+12;
                        }
                    }
                }
            }
            //if (util < maxscore) {
            //    if (maxscore <= harvscore) {
            //        creep.memory.job = "harv";
            //        creep.memory.utility = harvscore+12;
            //    }
            //    else if (maxscore <= upgdscore) {
            //        creep.memory.job = "upgd";
            //        creep.memory.utility = upgdscore+12;
            //    }
            //    else if (maxscore <= bldrscore) {
            //        creep.memory.job = "bldr";
            //        creep.memory.utility = bldrscore+12;
            //    }
            //    else if (maxscore <= reprscore) {
            //        creep.memory.job = "repr";
            //        creep.memory.utility = reprscore+12;
            //    }
            //}
        }
        creep.memory.utility -= Memory.level;
        if(creep.memory.job == null) {
            creep.memory.job = "null";
            creep.memory.utility = -100;
        }
        if (creep.memory.utility <= 0) {
            creep.memory.job = "null"
            creep.memory.utility = -100;
        }
        if (creep.memory.utility >= 100) {
            creep.memory.utility = 100;
        }
        if (nharv <= 0) {
            creep.memory.job = "harv";
            creep.memory.utility = 100;
        }
        if(creep.memory.job == "null") {
            //console.log("no more jobs, assigning arbitrarily");
            creep.memory.job = "harv";
            creep.memory.utility = harvscore;
        }
        creep.say(creep.memory.utility);
        if (creep.memory.job == "harv") {
	    if (creep.carry.energy < creep.carryCapacity) {
                var sources = creep.room.find(FIND_SOURCES);
                if (creep.memory.dest == -1) {
                    var source = sources[0];
                    var minlength = 100;
                    for (var i in sources) {
                        var length = creep.pos.findPathTo(sources[i].pos).length;
                        if (length < minlength) {
                            if (creep.room.memory.nharvs[i] <= creep.room.memory.maxnharvs[i]) {
                                var ret = 0;
                                for (var k = 0; k < 26; k++) {
                                    var kx = (k % 6) - 2;
                                    var ky = (k / 6) - 2;
                                    var pos = new RoomPosition(sources[i].pos.x+kx, sources[i].pos.y+ky, creep.room.name);
                                    creep.room.lookAt(pos).forEach(function(object) {
                                        if ((object.type == LOOK_CREEPS) && (!object.creep.my)) {
                                            ret += 1;
                                        }
                                    });
                                }
                                if (ret == 0) {
                                    source = sources[i];
                                    minlength = length;
                                    creep.memory.dest = i;
                                }
                            }
                        }
                    }
                }
                else {
                    var source = sources[creep.memory.dest];
                }
                if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
                else {
                    creep.memory.utility += Memory.level;
                }
            }
            else {
                var targets = creep.room.find(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return (structure.structureType == STRUCTURE_EXTENSION ||
                                    structure.structureType == STRUCTURE_SPAWN ||
                                    structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
                        }
                });
                var s = creep.room.find(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return (structure.structureType == STRUCTURE_SPAWN)
                        }
                });
                if(targets.length > 0) {
                    if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                    else {
                        creep.memory.dest = -1;
                        creep.memory.utility += 20;
                    }
                }
                else if (s.length) {
                    creep.moveTo(s[0], {visualizePathStyle: {stroke: '#ff0000'}});
                    creep.memory.job = "null";
                    creep.memory.utility = -100;
                }
            }
        }
        else if (creep.memory.job == "upgd") {
            if (creep.memory.upgrading && creep.carry.energy == 0) {
                creep.memory.upgrading = false;
            }
            if (!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
                creep.memory.upgrading = true;
            }
            if (creep.memory.upgrading) {
                if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
                }
                else {
                    creep.memory.dest = -1;
                    creep.memory.utility += Memory.level+1;
                }
            }
            else {
                var sources = creep.room.find(FIND_SOURCES);
                if (creep.memory.dest == -1) {
                    var source = sources[0];
                    var minlength = 100;
                    for (var i in sources) {
                        var length = creep.pos.findPathTo(sources[i].pos).length;
                        if (length < minlength) {
                            if (creep.room.memory.nharvs[i] <= creep.room.memory.maxnharvs[i]) {
                                var ret = 0;
                                for (var k = 0; k < 26; k++) {
                                    var kx = (k % 6) - 2;
                                    var ky = (k / 6) - 2;
                                    var pos = new RoomPosition(sources[i].pos.x+kx, sources[i].pos.y+ky, creep.room.name);
                                    creep.room.lookAt(pos).forEach(function(object) {
                                        if ((object.type == LOOK_CREEPS) && (!object.creep.my)) {
                                            ret += 1;
                                        }
                                    });
                                }
                                if (ret == 0) {
                                    source = sources[i];
                                    minlength = length;
                                    creep.memory.dest = i;
                                }
                            }
                        }
                    }
                }
                else {
                    var source = sources[creep.memory.dest];
                }

                if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
                else {
                    creep.memory.utility += 1;
                }
            }
        }
        else if (creep.memory.job == "bldr") {
            if (creep.memory.building && creep.carry.energy == 0) {
                creep.memory.building = false;
            }
            if (!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
                creep.memory.building = true;
            }
            if (creep.memory.building) {
                var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
                var s = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_SPAWN);
                    }
                });
                if (targets.length) {
                    if (creep.memory.builddest != null) {
                        var targ = Game.getObjectById(creep.memory.builddest);
                        if (targ != null) {
                            if (creep.build(targ) == ERR_NOT_IN_RANGE) {
                                creep.moveTo(targ, {visualizePathStyle: {stroke: '#ffffff'}});
                            }
                            else {
                                creep.memory.dest = -1;
                                creep.memory.utility += 2;
                            }       
                        }
                        else {
                            //creep.memory.job = "null";
                            creep.memory.utility -= 1;
                            creep.memory.builddest = null;
                        }
                    }
                    else {
                        var mindist = 100;
                        var shortest = 0;
                        for (var i in targets) {
                            var path = creep.room.findPath(targets[i].pos, creep.pos);
                            if (path.length < mindist) {
                                mindist = path.length
                                shortest = i;
                            }
                        }
                        creep.memory.builddest = targets[shortest].id;
                        if (creep.build(targets[shortest]) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(targets[shortest], {visualizePathStyle: {stroke: '#ffffff'}});
                        }
                        else {
                            creep.memory.dest = -1;
                            creep.memory.utility += 2;
                        }
                    }
                }
                else if (s.length) {
                    creep.moveTo(s[0], {visualizePathStyle: {stroke: '#ff0000'}});
                    creep.memory.job = "null";
                    creep.memory.utility = 0;
                }
            }
            else {
                var sources = creep.room.find(FIND_SOURCES);
                if (creep.memory.dest == -1) {
                    var source = sources[0];
                    var minlength = 100;
                    for (var i in sources) {
                        var length = creep.pos.findPathTo(sources[i].pos).length;
                        if (length < minlength) {
                            if (creep.room.memory.nharvs[i] <= creep.room.memory.maxnharvs[i]) {
                                var ret = 0;
                                for (var k = 0; k < 26; k++) {
                                    var kx = (k % 6) - 2;
                                    var ky = (k / 6) - 2;
                                    var pos = new RoomPosition(sources[i].pos.x+kx, sources[i].pos.y+ky, creep.room.name);
                                    creep.room.lookAt(pos).forEach(function(object) {
                                        if ((object.type == LOOK_CREEPS) && (!object.creep.my)) {
                                            ret += 1;
                                        }
                                    });
                                }
                                if (ret == 0) {
                                    source = sources[i];
                                    minlength = length;
                                    creep.memory.dest = i;
                                }
                            }
                        }
                    }
                }
                else {
                    var source = sources[creep.memory.dest];
                }

                if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
                else {
                    creep.memory.utility += Memory.level;
                }
            }
        }
        else if (creep.memory.job == "repr") {
            if (creep.memory.repairing && creep.carry.energy == 0) {
                creep.memory.repairing = false;
            }
            if (!creep.memory.repairing && creep.carry.energy == creep.carryCapacity) {
                creep.memory.repairing = true;
            }
            if (creep.memory.repairing) {
                var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: object => object.hits < object.hitsMax
                });
                if (targets.length) {
                    if (creep.memory.reprdest != null) {
                        var targ = Game.getObjectById(creep.memory.reprdest);
                        if (targ != null) {
                            if (creep.repair(targ) == ERR_NOT_IN_RANGE) {
                                creep.moveTo(targ, {visualizePathStyle: {stroke: '#ffffff'}});
                            }
                            else {
                                creep.memory.dest = -1;
                                creep.memory.utility += 2;
                            }       
                        }
                        else {
                            //creep.memory.job = "null";
                            creep.memory.utility -= 1;
                            creep.memory.repairdest = null;
                        }
                    }
                    else {
                        var mindist = 100;
                        var shortest = 0;
                        for (var i in targets) {
                            var path = creep.room.findPath(targets[i].pos, creep.pos);
                            if (path.length < mindist) {
                                mindist = path.length;
                                shortest = i;
                            }
                        }
                        creep.memory.repairdest = targets[shortest].id;
                        if (creep.repair(targets[shortest]) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(targets[shortest], {visualizePathStyle: {stroke: '#ffffff'}});
                        }
                        else {
                            creep.memory.dest = -1;
                            creep.memory.utility += 2;
                        }
                    }
                }
                else if (s.length) {
                    creep.moveTo(s[0], {visualizePathStyle: {stroke: '#ff0000'}});
                    creep.memory.job = "null";
                    creep.memory.utility = 0;
                }
            }
            else {
                var sources = creep.room.find(FIND_SOURCES);
                if (creep.memory.dest == -1) {
                    var source = sources[0];
                    var minlength = 100;
                    for (var i in sources) {
                        var length = creep.pos.findPathTo(sources[i].pos).length;
                        if (length < minlength) {
                            if (creep.room.memory.nharvs[i] <= creep.room.memory.maxnharvs[i]) {
                                var ret = 0;
                                for (var k = 0; k < 26; k++) {
                                    var kx = (k % 6) - 2;
                                    var ky = (k / 6) - 2;
                                    var pos = new RoomPosition(sources[i].pos.x+kx, sources[i].pos.y+ky, creep.room.name);
                                    creep.room.lookAt(pos).forEach(function(object) {
                                        if ((object.type == LOOK_CREEPS) && (!object.creep.my)) {
                                            ret += 1;
                                        }
                                    });
                                }
                                if (ret == 0) {
                                    source = sources[i];
                                    minlength = length;
                                    creep.memory.dest = i;
                                }
                            }
                        }
                    }
                }
                else {
                    var source = sources[creep.memory.dest];
                }

                if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
                else {
                    creep.memory.utility += Memory.level;
                }
            }
        }
    }
};

module.exports = roleHarvester;
