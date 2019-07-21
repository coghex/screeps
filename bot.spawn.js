var utilInit = require('util.init');
var utilHelp = require('util.help');
var botBase = require('bot.base');
var botCS = require('bot.cs');

//spawns attempt to maximize their own utility with no knowledge of others
var botSpawn = {
    init: function(s) {
        const spawn = Game.getObjectById(s);
        spawn.memory.level = 1;
        utilInit.initSpawn(s);
    },
    run: function(s) {
        const spawn = Game.getObjectById(s);
        // set nharvs every few ticks
        if (!(Game.time % 3)) {
            var r = spawn.room;
            var sources = r.find(FIND_SOURCES);
            for (var i in sources) {
                utilHelp.setNHarv(s, i);
            }
        }
        botBase.run(s);
        botCS.run(s);
    }
}

module.exports = botSpawn;
