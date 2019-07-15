var utilInit = require('util.init');
var botBase = require('bot.base');
var botCS = require('bot.cs');

//spawns attempt to maximize their own utility with no knowledge of others
var botSpawn = {
    init: function(s) {
        s.memory.level = 1;
        utilInit.initSpawn(s);
        botBase.init(s);
    },
    run: function(s) {
        botBase.run(s);
        botCS.run(s);
    }
}

module.exports = botSpawn;
