var botCreepSpawner = {
    run: function(s) {
        var nharv = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester').length;
        var nupgd = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader').length;
        var nbldr = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder').length;
        var lvl = s.memory.level;
        if (lvl == 0) {
            if (nharv < 2) {
                var name = 'harvy' + Game.time;
                s.spawnCreep([WORK,CARRY,MOVE], name, {memory: {role: 'harvester'}});
            }
            else if (nupgd < 1) {
                var name = 'grady' + Game.time;
                s.spawnCreep([WORK,CARRY,MOVE], name, {memory: {role: 'upgrader'}});
            }
            else if (nbldr < 1) {
                var name = 'bildy' + Game.time;
                s.spawnCreep([WORK,CARRY,MOVE], name, {memory: {role: 'builder'}});
            }
            else if (s.energy > 400) {
                s.memory.level = 1;
                console.log("spawn '" + s.name + "' has leveled up to 1");
            }
        }
        else if (lvl == 1) {
            if (nharv < 2) {
                var name = 'harvymkii' + Game.time;
                s.spawnCreep([WORK,WORK,CARRY,CARRY,MOVE,MOVE], name, {memory: {role: 'harvester'}});
            }
            else if (nupgd < 1) {
                var name = 'gradymkii' + Game.time;
                s.spawnCreep([WORK,WORK,CARRY,CARRY,MOVE,MOVE], name, {memory: {role: 'upgrader'}});
            }
            else if (nbldr < 1) {
                var name = 'bildymkii' + Game.time;
                s.spawnCreep([WORK,WORK,CARRY,CARRY,MOVE,MOVE], name, {memory: {role: 'builder'}});
            }
            else if (s.energy > 1000) {
                s.memory.level = 2;
                console.log("spawn '" + s.name + "' has leveled up to 2");
            }
        }
        else {
            console.log("spawn level not defined");
        }
    }
}

module.exports = botCreepSpawner;
