var botBase = require('bot.base');
var botCreepSpawner = require('bot.creepspawner');
var botCreeps = require('bot.creeps');

Game.spawns['Spawn1'].memory = { "ext" : [] }

module.exports.loop = function () {
    var s = Game.spawns['Spawn1'];
    botBase.run(s);
    botCreepSpawner.run(s);
    botCreeps.run();
}
