var roleHarvester = {
    run: function(creep) {
        creep.say(creep.memory.utility);
        var arr = [];
        for (const i in Game.creeps) {
            arr.push(Game.creeps[i].memory.job);
        }
        var nharv = arr.filter(j => (j == "harv")).length;
        var nupgd = arr.filter(j => (j == "upgd")).length;
        var nbldr = arr.filter(j => (j == "bldr")).length;
        var nrepr = arr.filter(j => (j == "repr")).length;
        var nnull = arr.filter(j => (j == "null")).length;
        if (arr.length) {
            //console.log("nharv: " + nharv + ". nupgd: " + nupgd + ", nbldr: " + nbldr);
            var powerscore = creep.room.energyCapacityAvailable - creep.room.energyAvailable;
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            var repairtargets = creep.room.find(FIND_STRUCTURES, {
                filter: object => object.hits < object.hitsMax
            });
            var buildscore = targets.length;
            var repairscore = repairtargets.length;
            var ncreeps = arr.length;
            var bldrscore = 100-((10*nbldr)/Memory.level);
            var upgdscore = 100-((50*nupgd)/Memory.level);
            var harvscore = 100-((20*nharv)/Memory.level);
            var reprscore = 100-((50*nrepr)/Memory.level);
            if ((powerscore < 40)) {
                harvscore -= 80;
            }
            else {
                harvscore += 40;
            }
            if (buildscore < 1) {
                bldrscore -= 20;
            }
            else {
                bldrscore += 40;
            }
            if (repairscore < 1) {
                reprscore += 20;
            }
            //console.log("harvscore: " + harvscore + ". upgdscore: " + upgdscore + ", bldrscore: " + bldrscore);

            var util = creep.memory.utility + 12;
            if ((util < harvscore) || (util < bldrscore) || (util < upgdscore) || (util < reprscore)) {
                const mat = [harvscore, bldrscore, upgdscore, reprscore];
                var max = harvscore;
                var maxi = 0;
                for (var i = 1; i < mat.length; i++) {
                    if (mat[i] > max) {
                        maxi = i;
                        max = mat[i];
                    }
                }
                if (maxi == 0) {
                    creep.memory.job = "harv";
                    creep.memory.utility = harvscore+1;
                }
                else if (maxi == 1) {
                    creep.memory.job = "bldr";
                    creep.memory.utility = bldrscore+1;
                }
                else if (maxi == 2) {
                    creep.memory.job = "upgd";
                    creep.memory.utility = upgdscore+1;
                }
                else if ((maxi == 3) && (creep.room.level > 1)) {
                    creep.memory.job = "repr";
                    creep.memory.utility = reprscore+1;
                }
                //if (harvscore > bldrscore) {
                //    if (harvscore > upgdscore) {
                //        creep.memory.job = "harv";
                //        creep.memory.utility = harvscore+12;
                //    }
                //    else {
                //        creep.memory.job = "upgd";
                //        creep.memory.utility = upgdscore+12;
                //    }
                //}
                //else {
                //    if (bldrscore > upgdscore) {
                //        creep.memory.job = "bldr";
                //        creep.memory.utility = bldrscore+12;
                //    }
                //    else {
                //        creep.memory.job = "upgd";
                //        creep.memory.utility = upgdscore+12;
                //    }
                //}
            }
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
            creep.memory.job = "upgd";
            creep.memory.utility = upgdscore+24;
        }
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
                    var mindist = 100;
                    var shortest = 0;
                    for (var i in targets) {
                        var path = creep.room.findPath(targets[i].pos, creep.pos);
                        if (path.length < mindist) {
                            mindist = path.length
                            shortest = i;
                        }
                    }
                    if (creep.build(targets[shortest]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[shortest], {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                    else {
                        creep.memory.dest = -1;
                        creep.memory.utility += 2;
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
                if (creep.memory.repairtarget != null) {
                    const targets = creep.room.find(FIND_STRUCTURES, {
                        filter: object => object.hits < object.hitsMax
                    });
                    targets.sort((a,b) => a.hits - b.hits);
                    creep.memory.repairtarget = targets[0].id;
                    if (targets.length > 0) {
                        if(creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                        }
                    }
                    else {
                        creep.memory.utility = -1;
                    }
                }
                else {
                    if (creep.repair(Game.getObjectById(creep.memory.repairtarget)) == ERR_NOT_IN_RANGE) {
                            creep.moveTo((Game.getObjectById(creep.memory.repairtarget)), {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                    else {
                        creep.memory.dest = -1;
                        creep.memory.utility += Memory.level+1;
                    }
                    if (Game.getObjectById(creep.memory.repairtarget) != null) {
                        if (Game.getObjectById(creep.memory.repairtarget).hits >= Game.getObjectById(creep.memory.repairtarget).hitsMax) {
                            creep.memory.repairtarget = null;
                        }
                    }   
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
    }
};

module.exports = roleHarvester;
