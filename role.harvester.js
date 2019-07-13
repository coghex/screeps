var roleHarvester = {
    run: function(creep) {
        var arr = [];
        for (const i in Game.creeps) {
            arr.push(Game.creeps[i].memory.job);
        }
        var nharv = arr.filter(j => (j == "harv")).length;
        var nupgd = arr.filter(j => (j == "upgd")).length;
        var nbldr = arr.filter(j => (j == "bldr")).length;
        if(creep.memory.job == null) {
            creep.memory.job = "null";
            creep.memory.utility = -100;
        }
        creep.say(creep.memory.utility);
        if (creep.memory.utility <= 0) {
            creep.memory.job = "null"
            creep.memory.utility = -100;
        }
        else {
            creep.memory.utility -= 1;
        }
        if (creep.memory.utility >= 100) {
            creep.memory.utility = 100;
        }
        if (nharv <= 0) {
            creep.memory.job = "harv";
            creep.memory.utility = 100;
        }
        if(creep.memory.job == "null") {
            if (arr.length) {
                //console.log("nharv: " + nharv + ". nupgd: " + nupgd + ", nbldr: " + nbldr);
                var powerscore = creep.room.energyCapacityAvailable - creep.room.energyAvailable;
                var bldrscore = 99-((30*nbldr)/Memory.level);
                var upgdscore = 99-((100*nupgd)/Memory.level);
                var harvscore = 100-((25*nharv)/Memory.level);
                if ((powerscore < 40)) {
                    harvscore -= 80;
                }
                else {
                    harvscore += 20;
                }
                //console.log("harvscore: " + harvscore + ". upgdscore: " + upgdscore + ", bldrscore: " + bldrscore);

                if (harvscore > bldrscore) {
                    if (harvscore > upgdscore) {
                        creep.memory.job = "harv";
                        creep.memory.utility = harvscore;
                    }
                    else {
                        creep.memory.job = "upgd";
                        creep.memory.utility = upgdscore;
                    }
                }
                else {
                    if (bldrscore > upgdscore) {
                        creep.memory.job = "bldr";
                        creep.memory.utility = bldrscore;
                    }
                    else {
                        creep.memory.job = "upgd";
                        creep.memory.utility = upgdscore;
                    }
                }
            }
            else {
                console.log("no more jobs, assigning harvester");
                creep.memory.job = "harv";
                creep.memory.utility = harvscore;
            }
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
                                source = sources[i];
                                minlength = length;
                                creep.memory.dest = i;
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
                    creep.memory.utility += 1;
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
                        creep.memory.utility += 40;
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
                    creep.memory.utility += 2;
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
                                source = sources[i];
                                minlength = length;
                                creep.memory.dest = i;
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
                    if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                    else {
                        creep.memory.dest = -1;
                        creep.memory.utility += 5;
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
                                source = sources[i];
                                minlength = length;
                                creep.memory.dest = i;
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
