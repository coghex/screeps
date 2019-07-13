var botCreepSpawner = {
    run: function(s) {
        var nharv = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester').length;
        var lvl = s.memory.level;
        if (lvl == 1) {
            if (nharv < 4) {
                var name = 'harvy' + Game.time;
                s.spawnCreep([WORK,CARRY,MOVE], name, {memory: {role: 'harvester', dest : -1 }});
                //Game.creeps[name].memory.job = "null";
                //Game.creeps[name].memory.utility = 0;
            }
            else if (s.room.energyCapacityAvailable > 400) {
                s.memory.level = 2;
                console.log("spawn '" + s.name + "' has leveled up to 2");
            }
        }
        else if (lvl == 2) {
            if (nharv < 8) {
                var name = 'harvymkii' + Game.time;
                s.spawnCreep([WORK,WORK,CARRY,CARRY,MOVE,MOVE], name, {memory: {role: 'harvester', dest : -1 }});
                //Game.creeps[name].memory.job = "null";
                //Game.creeps[name].memory.utility = 0;
            }
            else if (s.energy > 1000) {
                s.memory.level = 3;
                console.log("spawn '" + s.name + "' has leveled up to 3");
            }
        }
        else {
            console.log("spawn level not defined");
        }
    }
}

module.exports = botCreepSpawner;
