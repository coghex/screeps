var botColony = require('bot.colony');
var botCreep = require('bot.creep');

//the empire is made up of colonies
var botEmpire = {
    init: function(s) {
        botColony.init(s);
    },
    run: function() {
        botColony.run();
        botCreep.run();
    }
}

module.exports = botEmpire;
