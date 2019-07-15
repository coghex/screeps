var roleWorker = require('role.worker');

var botCreeps = {
    run: function(s) {
        for (var name in Game.creeps) {
            var creep = Game.creeps[name];
            if (creep.memory.role == 'worker') {
                roleWorker.run(creep);
            }
            else {
                if (!Memory.halt) {
                    Memory.halt = 1;
                    console.log("ERR: role not defined");
                }
            }
        }
    }
}

module.exports = botCreeps;
