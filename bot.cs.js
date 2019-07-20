var utilHelp = require('util.help');

// creep spawning manager
var botCS = {
    run: function(s) {
        if (!(Game.time % 7)) {
            const nworker = _.filter(Game.creeps, (creep) => creep.memory.role == 'worker').length;
            const nsentinel = _.filter(Game.creeps, (creep) => creep.memory.role == 'sentinel').length;
            const nmedic = _.filter(Game.creeps, (creep) => creep.memory.role == 'medic').length;
            const nseeker = _.filter(Game.creeps, (creep) => creep.memory.role == 'seeker').length;
            const lvl = s.memory.level;
            if ((Memory.debug >= 4) && (!(Game.time % 1000))) {
                console.log("you have " + nworker + " workers, " + nsentinel + " sentinels, " + nmedic + " medics, and " + nseeker + " seekers");
            }
            const sources = s.room.find(FIND_SOURCES, {
                filter: (source) => (utilHelp.safePos(source.pos, source.room, 2) == 0)
            });
            const nsources = s.room.memory.maxnharvs.reduce((a,b) => a+b, 0);
            switch (lvl) {
                case (1):
                    if (nworker < (nsources/2)) {
                        if ((s.room.energyCapacityAvailable < 400) && (s.room.energyAvailable >= 300)) {
                            var name = "workerMkI#" + Game.time;
                            s.spawnCreep([WORK,CARRY,MOVE,MOVE,MOVE], name, { memory: { role: 'worker'
                                                                                      , job: 'null'
                                                                                      , utility: 0 } });
                            if ((Memory.debug > 2)) {
                                console.log("spawning creep " + name + " at " + s.name);
                            }
                        }
                        else if (s.room.energyCapacityAvailable >= 400) {
                            s.memory.level = 2;
                            if ((Memory.debug > 1)) {
                                console.log("spawn " + s.name + " has leveled up to 2...");
                            }
                        }
                    }
                    break;
                case (2):
                    if (nworker < nsources/2+1) {
                        if ((s.room.energyCapacityAvailable < 500) && (s.room.energyAvailable >= 400)) {
                            var name = "workerMkII#" + Game.time;
                            s.spawnCreep([WORK,WORK,CARRY,MOVE,MOVE,MOVE], name, { memory: { role: 'worker'
                                                                                           , job : 'null'
                                                                                           , utility: 0 } });
                            if ((Memory.debug > 2)) {
                                console.log("spawning creep " + name + " at " + s.name);
                            }
                        }
                        else if (s.room.energyCapacityAvailable >= 500) {
                            s.memory.level = 3;
                            if ((Memory.debug > 1)) {
                                console.log("spawn " + s.name + " has leveled up to 3...");
                            }
                        }
                    }
                    break;
                case (3):
                    if (nworker < nsources) {
                        if ((s.room.energyCapacityAvailable < 600) && (s.room.energyAvailable >= 500)) {
                            var name = "workerMkIII#" + Game.time;
                            s.spawnCreep([WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], name, { memory: { role: 'worker'
                                                                                            , job : 'null'
                                                                                            , utility: 0 } });
                            if ((Memory.debug > 2)) {
                                console.log("spawning creep " + name + " at " + s.name);
                            }
                        }
                        else if (s.room.energyCapacityAvailable >= 600) {
                            s.memory.level = 4;
                            if ((Memory.debug > 1)) {
                                console.log("spawn " + s,name + "has leveled up to 4...");
                            }
                        }
                    }
                    break;
                default:
                    if (!Memory.halt) {
                        console.log("ERR: creepspawning level not defined");
                        Memory.halt = 1;
                    }
            }
        }
    }
}

module.exports = botCS;
