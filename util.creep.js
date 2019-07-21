var utilHelp = require('util.help');
//creep related helper functions
var utilCreep = {
    // collects creep name garbage every 24 ticks
    freeCreepMemory: function() {
        if (!(Game.time % 24)) {
            for (var name in Memory.creeps) {
                if (!Game.creeps[name]) {
                    delete Memory.creeps[name];
                    if (Memory.debug > 2) {
                        console.log("removing dead creep " + name);
                    }
                }
            }
        }
    },
    // causes a creep to look for the nearest source and harvest it
    creepGetEnergy: function(c) {
        const creep = Game.getObjectById(c);
        const sources = creep.room.find(FIND_SOURCES);
        const spawn = creep.room.find(FIND_MY_SPAWNS);
        if (creep.memory.dest == null) {
            var source = sources[0];
            var minlength = 100;
            for (var i in sources) {
                if (sources[i].energy) {
                    const length = creep.pos.findPathTo(sources[i].pos).length;
                    if (length < minlength) {
                        if (creep.room.memory.nharvs[i] < creep.room.memory.maxnharvs[i]) {
                            const ret = utilHelp.safePos(sources[i].pos, spawn[0].id, 2);
                            if (ret == 0) {
                                source = sources[i];
                                minlength = length;
                                creep.memory.dest = i;
                            }
                        }
                    }
                }
            }
        }
        else {
            var source = sources[creep.memory.dest];
        }
        const err = creep.harvest(source);
        if (err == ERR_NOT_IN_RANGE) {
            creep.moveTo(source);
        }
        else if (err == ERR_NOT_ENOUGH_RESOURCES) {
            creep.memory.dest = null;
        }
        else {
            creep.memory.utility += 1;
        }
    },
    // causes a creep to look for the nearest structure and transfers all energy to it
    creepTransferToStructure: function(c) {
        const creep = Game.getObjectById(c);
        var towers = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
            }
        });
        if (towers.length) {
            if (creep.transfer(towers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(towers[0]);
            }
            else {
                creep.memory.utility += 40;
                return;
            }
        }
        var exts = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_EXTENSION) && structure.energy < structure.energyCapacity;
            }
        });       
        if (exts.length) {
            if (creep.transfer(exts[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(exts[0]);
            }
            else {
                creep.memory.utility += 20;
                return;
            }
        }
        var spwns = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_SPAWN) && structure.energy < structure.energyCapacity;
            }
        });
        if (spwns.length) {
            if (creep.transfer(spwns[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(spwns[0]);
            }
            else {
                creep.memory.utility += 10;
                return;
            }
        }
        else {
            creep.memory.job = "null";
            creep.memory.utility = -100;
            return;
        }       
    },
    // builds nearest constuction site, extensions first
    creepBuild: function(c) {
        const creep = Game.getObjectById(c);
        var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
        if (targets.length) {
            if (creep.memory.builddest != null) {
                var target = Game.getObjectById(creep.memory.builddest);
                if (target != null) {
                    if (creep.build(target) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                    }
                    else {
                        creep.memory.utility += 2;
                    }
                }
                else {
                    creep.memory.builddest = null;
                }
            }
            else {
                var mindist = 100;
                var shortest = 0;
                for (var i in targets) {
                    var path = creep.room.findPath(targets[i].pos, creep.pos);
                    if (targets[i].structureType == STRUCTURE_EXTENSION) {
                        mindist = path.length;
                        shortest = i
                        break;
                    }
                    else {
                        if (path.length < mindist) {
                            mindist = path.length;
                            shortest = i;
                        }
                    }
                }
                creep.memory.builddest = targets[shortest].id;
                if (creep.build(targets[shortest]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[shortest]);
                }
                else {
                    creep.memory.utility += 2;
                }
            }
        }
        else {
            creep.memory.job = "null";
            creep.memory.utility = -100;
        }
    },
    // repairs the nearest thing that needs repairing
    creepRepair: function(c) {
        const creep = Game.getObjectById(c);
        var targets = creep.room.find(FIND_STRUCTURES, {
            filter: object => object.hits < (object.hitsMax-800)
        });
        if ((targets == null) || (!targets.length)) {
            creep.memory.job = "null";
            creep.memory.utility = -100;
        }
        else if (targets.length) {
            if (creep.memory.reprdest != null) {
                var targ = Game.getObjectById(creep.memory.reprdest);
                if (targ != null) {
                    if (creep.repair(targ) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targ);
                    }
                    else {
                        creep.memory.dest = null;
                        creep.memory.utility = null;
                    }
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
                    creep.moveTo(targets[shortest]);
                }
                else {
                    creep.memory.dest = null;
                    creep.memory.utility += 5;
                }
            }
        }
    }
}

module.exports = utilCreep;
