var utilHelp = {
    freeCreepMemory: function() {
        for (var name in Memory.creeps) {
            if (!Game.creeps[name]) {
                delete Memory.creeps[name];
                if (Memory.creepdebug == 1) {
                    console.log("removing dead creep " + name);
                }
            }
        }
    }    
}

module.exports = utilHelp;
