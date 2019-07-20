var utilHelp = require('util.help');
var botEmpire = require('bot.empire');
const s = Game.spawns['Spawn1'];
const debuglevel = 2;

module.exports.loop = function () {
    if (Memory.init != null) {
        utilHelp.freeCreepMemory();
        botEmpire.run();
    }
    else {
        Memory.debug = debuglevel;
        if (Memory.debug) {
            console.log("initializing the empire...");
        }
        botEmpire.init(s);
        Memory.init = 1;
    }
}
