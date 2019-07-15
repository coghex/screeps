var botSpawn = require('bot.spawn');
var botCreeps = require('bot.creeps');

var botEmpire = {
    init: function(s) {
        Memory.nspawns = 1;
        Memory.myspawns = [s.id];
        botSpawn.init(s);
    },
    run: function() {
        for (var i in Memory.myspawns) {
            botSpawn.run(Game.getObjectById(Memory.myspawns[i]));
        }
        botCreeps.run();
    }
}

module.exports = botEmpire;
