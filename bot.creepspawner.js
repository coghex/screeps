var botCreepSpawner = {
    run: function(s) {
        var nharv = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester').length;
        //var nupgd = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader').length;
        //var nbldr = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder').length;
        var lvl = s.memory.level;
        if (lvl == 1) {
            if (nharv < 4) {
                var name = 'harvy' + Game.time;
                s.spawnCreep([WORK,CARRY,MOVE], name, {memory: {role: 'harvester'}});
                //Game.creeps[name].memory.job = "null";
                //Game.creeps[name].memory.utility = 0;
            }
        //    else if (nupgd < 1) {
        //        var name = 'grady' + Game.time;
        //        s.spawnCreep([WORK,CARRY,MOVE], name, {memory: {role: 'upgrader'}});
        //    }
        //    else if (nbldr < 1) {
        //        var name = 'bildy' + Game.time;
        //        s.spawnCreep([WORK,CARRY,MOVE], name, {memory: {role: 'builder'}});
        //    }
            else if (s.room.energyCapacityAvailable > 400) {
                s.memory.level = 2;
                console.log("spawn '" + s.name + "' has leveled up to 2");
            }
        }
        else if (lvl == 2) {
            if (nharv < 8) {
                var name = 'harvymkii' + Game.time;
                s.spawnCreep([WORK,WORK,CARRY,CARRY,MOVE,MOVE], name, {memory: {role: 'harvester'}});
                //Game.creeps[name].memory.job = "null";
                //Game.creeps[name].memory.utility = 0;
            }
        //    else if (nupgd < 1) {
        //        var name = 'gradymkii' + Game.time;
        //        s.spawnCreep([WORK,WORK,CARRY,CARRY,MOVE,MOVE], name, {memory: {role: 'upgrader'}});
        //    }
        //    else if (nbldr < 1) {
        //        var name = 'bildymkii' + Game.time;
        //        s.spawnCreep([WORK,WORK,CARRY,CARRY,MOVE,MOVE], name, {memory: {role: 'builder'}});
        //    }
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
