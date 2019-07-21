var botSpawn = require('bot.spawn');

//colonies manage rooms and multiple spawns
var botColony = {
    init: function(s) {
        Memory.nspawns = 1;
        Memory.myspawns = [s];
        botSpawn.init(s);
    },
    run: function() {
        for (var i in Memory.myspawns) {
            botSpawn.run(Memory.myspawns[i]);
        }
    }
}

module.exports = botColony;
