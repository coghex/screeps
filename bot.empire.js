var botSpawn = require('bot.spawn');
var botCreeps = require('bot.creeps');

var botEmpire = {
    init: function(s) {
        Memory.nspawns = 1;
        Memory.spawns = [s.id];
        botSpawn.init(s);
    },
    run: function() {
        for (var i in Memory.spawns) {
            botSpawn.run(Game.getObjectById(Memory.spawns[i]));
        }
        botCreeps.run();
    }
}

module.exports = botEmpire;
