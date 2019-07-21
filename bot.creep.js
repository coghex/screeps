var roleWorker = require('role.worker');

//creeps attempt to maximize utility wherever they are, they know
//no home (spawn or colony) other than the empire.
var botCreep = {
    run: function() {
        for (var name in Game.creeps) {
            var creep = Game.creeps[name];
            if (creep.memory.role == 'worker') {
                roleWorker.run(creep.id);
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

module.exports = botCreep;
