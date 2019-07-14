var roleSentinel = {
    run: function(creep) {
        if (creep.memory.job == null) {
            creep.memory.job = "null";
            creep.memory.utility = -100;
        }
        if (creep.memory.utility <= 0) {
            creep.memory.utility = 0;
        }
        if (creep.memory.utility > 100) {
            creep.memory.utility = 100;
        }
        creep.memory.utility -= Memory.level;
        var targetid = creep.memory.targetid;
        const targets = creep.room.find(FIND_HOSTILE_CREEPS);
        if (targets.length) {
            creep.memory.job = "kill";
            creep.memory.utility = 100;
            target = targets[0].id;
        }
        else {
            delete creep.memory.targetid;
            creep.memory.job = "spku";
            creep.memory.utility = -100;
        }
        if (creep.memory.job == "kill") {
            creep.memory.utility += Memory.level;
            if (creep.memory.targetid == null) {
                var minlength = 100;
                for (var i in targets) {
                    var length = creep.pos.findPathTo(targets[i].pos).length;
                    if (length < minlength) {
                        targetid = targets[i].id;
                        creep.memory.targetid = targetid;
                        minlength = length;
                    }
                }
            }
            else {
                if (target.body > creep.memory.bodies) {
                    creep.memory.job = "bide";
                }
                else if(creep.attack(Game.getObjectById(targetid)) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(Game.getObjectById(targetid), {visualizePathStyle: {stroke: '#ff0000'}});
                }
            }
        }
        else if (creep.memory.job = "bide") {
            creep.memory.utility += 1;
        }
        else if (creep.memory.job == "spku") {
            creep.suicide();
        }
        else {
            creep.memory.job = "null";
        }
    }
}

module.exports = roleSentinel;
