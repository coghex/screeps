var utilInit = require('util.init');
var utilHelp = require('util.help');
var botBase = require('bot.base');
var botCS = require('bot.cs');

//spawns attempt to maximize their own utility with no knowledge of others
var botSpawn = {
    init: function(s) {
        s.memory.level = 1;
        utilInit.initSpawn(s);
    },
    run: function(s) {
        // set nharvs every tick
        var r = s.room;
        var sources = r.find(FIND_SOURCES);
        for (var i in sources) {
            utilHelp.setNHarv(r, sources, i);
        }
        botBase.run(s);
        botCS.run(s);
    }
}

module.exports = botSpawn;
