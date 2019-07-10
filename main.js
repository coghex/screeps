var botBase = require('bot.base');
var botCreepSpawner = require('bot.creepspawner');
var botCreeps = require('bot.creeps');
var utilMem = require('util.mem');

module.exports.loop = function () {
    var s = Game.spawns['Spawn1'];
    if (s.memory.init != null) {
        botBase.run(s);
        botCreepSpawner.run(s);
        botCreeps.run();
    }
    else {
        utilMem.init();
        s.memory.init = 1;
    }
}
