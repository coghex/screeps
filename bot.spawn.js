var botBase = require('bot.base');
var botCS = require('bot.cs');

var botSpawn = {
    init: function(s) {
        s.memory.level = 1;
        botBase.init(s);
    },
    run: function(s) {
        botBase.run(s);
        botCS.run(s);
    }
}

module.exports = botSpawn;
