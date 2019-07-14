var botBase = require('bot.base');
var botCreepSpawner = require('bot.creepspawner');
var botCreeps = require('bot.creeps');
var utilMem = require('util.mem');

module.exports.loop = function () {
    for (var name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log("removing dead creep " + name);
        }
    }
    const s = Game.spawns['Spawn1'];
    Memory.level = s.memory.level;
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
