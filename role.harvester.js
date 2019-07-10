var roleHarvester = {
    run: function(creep) {
        if(creep.memory.job == null) {
            creep.memory.job = "null";
            creep.memory.utility = 0;
        }
        if(creep.memory.job == "null") {
            var arr = [];
            for (const i in Game.creeps) {
                arr.push(Game.creeps[i].memory.job);
            }
            if (arr.length) {
                var nharv = arr.filter(j => (j == "harv")).length;
                var nupgd = arr.filter(j => (j == "upgd")).length;
                var nbldr = arr.filter(j => (j == "bldr")).length;
                var bldrscore = 99-(60*nbldr);
                var upgdscore = 99-(100*nupgd);
                var harvscore = 100-(25*nharv);

                if (bldrscore > upgdscore) {
                    if (upgdscore > harvscore) {
                        creep.memory.job = "bldr";
                        creep.memory.utility = bldrscore;
                    }
                    else if (harvscore > bldrscore) {
                        creep.memory.job = "harv";
                        creep.memory.utility = harvscore;
                    }
                }
                else {
                    if (bldrscore > harvscore) {
                        creep.memory.job = "upgd";
                        creep.memory.utility = upgdscore;
                    }
                    else if (harvscore > upgdscore) {
                        creep.memory.job = "harv";
                        creep.memory.utility = harvscore;
                    }
                }
            }
            else {
                console.log("no more jobs");
                creep.memory.job = "harv";
                creep.memory.utility = harvscore;
            }
        }
        if (creep.memory.job == "harv") {
	        if (creep.carry.energy < creep.carryCapacity) {
                //var sources = creep.room.find(FIND_SOURCES);
                var source = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
                if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
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
                }
                else if (s.length) {
                    creep.moveTo(s[0], {visualizePathStyle: {stroke: '#ff0000'}});
                }
            }
        }
        else if (creep.memory.job == "upgd") {
            if (creep.memory.upgrading && creep.carry.energy == 0) {
                creep.memory.upgrading = false;
                creep.say('harvesting...');
            }
            if (!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
                creep.memory.upgrading = true;
                creep.say('upgrading...');
            }
            if (creep.memory.upgrading) {
                if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
            else {
                var sources = creep.room.find(FIND_SOURCES);
                if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
        }
	}
};

module.exports = roleHarvester;
