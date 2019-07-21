var utilCreep = require('util.creep');
var botEmpire = require('bot.empire');
const s = Game.spawns['Spawn1'];
const debuglevel = 2;

module.exports.loop = function () {
    if (s == null) {
        console.log("ERR: no spawn");
    }
    if (Memory.init != null) {
        utilCreep.freeCreepMemory();
        botEmpire.run();
    }
    else {
        Memory.debug = debuglevel;
        if (Memory.debug) {
            console.log("initializing the empire...");
        }
        botEmpire.init(s.id);
        Memory.init = 1;
    }
}
