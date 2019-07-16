//random helper functions
var utilHelp = {
    // collects creep name garbage
    freeCreepMemory: function() {
        for (var name in Memory.creeps) {
            if (!Game.creeps[name]) {
                delete Memory.creeps[name];
                if (Memory.debug >= 2) {
                    console.log("removing dead creep " + name);
                }
            }
        }
    },
    // decides if the position is safe for n tiles around, returns the number of threats
    safePos: function(p, r, n) {
        const looplength = (n+1)*(n+1);
        var ret = 0;
        for (var k = 0; k < looplength; k++) {
            const kx = (k % (n+1)) - (n-1);
            const ky = Math.floor(k / (n+1)) - (n-1);
            const testpos = new RoomPosition(p.x+kx, p.y+ky, r.name);
            r.lookAt(testpos).forEach(function(obj) {
                if ((obj.type == LOOK_CREEPS) && (!obj.creep.my)) {
                    ret += 1;
                }
            });
        }
        return ret;
    },
    // causes a creep to look for the nearest source and harvest it
    creepGetEnergy: function(creep) {
        const sources = creep.room.find(FIND_SOURCES);
        if (creep.memory.dest == null) {
            var source = sources[0];
            var minlength = 100;
            for (var i in sources) {
                const length = creep.pos.findPathTo(sources[i].pos).length;
                if (length < minlength) {
                    if (creep.room.memory.nharvs[i] < creep.room.memory.maxnharvs[i]) {
                        const ret = utilHelp.safePos(sources[i].pos, creep.room, 2);
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
            creep.moveTo(source);
        }
        else {
            creep.memory.utility += 1;
        }
    },
    // causes a creep to look for the nearest structure and transfers all energy to it
    creepTransferToStructure: function(creep) {
        var targets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN ||
                        structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
            }
        });
        if (targets.length) {
            if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0]);
            }
            else {
                creep.memory.utility += 20;
            }
        }
        else {
            creep.memory.job = "null";
            creep.memory.utility = -100;
        }
    },
    creepBuild: function(creep) {
        var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
        if (targets.length) {
            if (creep.memory.builddest != null) {
                var target = Game.getObjectById(creep.memory.builddest);
                if (target != null) {
                    if (creep.build(target) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                    }
                    else {
                        creep.memory.builddest = null;
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
                creep.memory.builddest = targets[shortest],id;
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
    }
}

module.exports = utilHelp;
