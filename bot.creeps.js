var roleHarvester = require('role.harvester');
var roleSentinel = require('role.sentinel');
var roleApothecary = require('role.apothecary');

var botCreeps = {
    run: function() {
        for(var name in Game.creeps) {
            var creep = Game.creeps[name];
            if (creep.memory.role == 'harvester') {
                roleHarvester.run(creep);
            }
            if (creep.memory.role == 'sentinel') {
                roleSentinel.run(creep);
            }
        }
    }
}

module.exports = botCreeps;
