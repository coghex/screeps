var utilHelp = require('util.help');

// creep spawning manager
var botCS = {
    run: function(s) {
        const spawn = Game.getObjectById(s);
        if (!(Game.time % 7)) {
            const nworker = _.filter(Game.creeps, (creep) => creep.memory.role == 'worker').length;
            const nsentinel = _.filter(Game.creeps, (creep) => creep.memory.role == 'sentinel').length;
            const nmedic = _.filter(Game.creeps, (creep) => creep.memory.role == 'medic').length;
            const nseeker = _.filter(Game.creeps, (creep) => creep.memory.role == 'seeker').length;
            const lvl = spawn.memory.level;
            if ((Memory.debug >= 4) && (!(Game.time % 1000))) {
                console.log("you have " + nworker + " workers, " + nsentinel + " sentinels, " + nmedic + " medics, and " + nseeker + " seekers");
            }
            const sources = spawn.room.find(FIND_SOURCES, {
                filter: (source) => (utilHelp.safePos(source.pos, s, 2) == 0)
            });
            const nsources = spawn.room.memory.maxnharvs.reduce((a,b) => a+b, 0);
            switch (lvl) {
                case (1):
                    if (nworker < (3+(nsources/4))) {
                        if ((spawn.room.energyCapacityAvailable < 400) && (spawn.room.energyAvailable >= 300)) {
                            var name = "workerMkI#" + Game.time;
                            spawn.spawnCreep([WORK,CARRY,MOVE,MOVE,MOVE], name, { memory: { role: 'worker'
                                                                                          , job: 'null'
                                                                                          , utility: 0 } });
                            if ((Memory.debug > 2)) {
                                console.log("spawning creep " + name + " at " + spawn.name);
                            }
                        }
                        else if (spawn.room.energyCapacityAvailable >= 400) {
                            spawn.memory.level = 2;
                            if ((Memory.debug > 1)) {
                                console.log("spawn " + spawn.name + " has leveled up to 2...");
                            }
                        }
                    }
                    break;
                case (2):
                    if (nworker < (2+(nsources/3))) {
                        if ((spawn.room.energyCapacityAvailable < 500) && (spawn.room.energyAvailable >= 400)) {
                            var name = "workerMkII#" + Game.time;
                            spawn.spawnCreep([WORK,WORK,CARRY,MOVE,MOVE,MOVE], name, { memory: { role: 'worker'
                                                                                               , job : 'null'
                                                                                               , utility: 0 } });
                            if ((Memory.debug > 2)) {
                                console.log("spawning creep " + name + " at " + spawn.name);
                            }
                        }
                        else if (spawn.room.energyCapacityAvailable >= 500) {
                            spawn.memory.level = 3;
                            if ((Memory.debug > 1)) {
                                console.log("spawn " + spawn.name + " has leveled up to 3...");
                            }
                        }
                    }
                    break;
                case (3):
                    if (nworker < (1+(nsources/2))) {
                        if ((spawn.room.energyCapacityAvailable < 550) && (spawn.room.energyAvailable >= 500)) {
                            var name = "workerMkIII#" + Game.time;
                            spawn.spawnCreep([WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], name, { memory: { role: 'worker'
                                                                                                , job : 'null'
                                                                                                , utility: 0 } });
                            if ((Memory.debug > 2)) {
                                console.log("spawning creep " + name + " at " + spawn.name);
                            }
                        }
                        else if (spawn.room.energyCapacityAvailable >= 550) {
                            spawn.memory.level = 4;
                            if ((Memory.debug > 1)) {
                                console.log("spawn " + spawn.name + " has leveled up to 4...");
                            }
                        }
                    }
                    break;
                case (4):
                    if (nworker < (1+(nsources/2))) {
                        if ((spawn.room.energyCapacityAvailable < 600) && (spawn.room.energyAvailable >= 550)) {
                            var name = "workerMkIII#" + Game.time;
                            spawn.spawnCreep([WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE], name, { memory: { role: 'worker'
                                                                                                , job : 'null'
                                                                                                , utility: 0 } });
                            if ((Memory.debug > 2)) {
                                console.log("spawning creep " + name + " at " + spawn.name);
                            }
                        }
                        else if (spawn.room.energyCapacityAvailable >= 600) {
                            spawn.memory.level = 4;
                            if ((Memory.debug > 1)) {
                                console.log("spawn " + spawn.name + " has leveled up to 5...");
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
