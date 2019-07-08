var botCreepSpawner = {
    run: function(s) {
        var nharv = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester').length;
        var nupgd = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader').length;
        var nbldr = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder').length;
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
        else {
            console.log("nharv: " + nharv + ", nupgd: " + nupgd + ", nbldr: " + nbldr);
        }
    }
}

module.exports = botCreepSpawner;
