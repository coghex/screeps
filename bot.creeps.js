var roleHarvester = require('role.harvester');

var botCreeps = {
    run: function() {
        for(var name in Game.creeps) {
            var creep = Game.creeps[name];
            if (creep.memory.role == 'harvester') {
                roleHarvester.run(creep);
            }
        }
    }
}

module.exports = botCreeps;
