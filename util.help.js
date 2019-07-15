//random helper functions
var utilHelp = {
    // collects creep name garbage
    freeCreepMemory: function() {
        for (var name in Memory.creeps) {
            if (!Game.creeps[name]) {
                delete Memory.creeps[name];
                if (Memory.debug >= 2) {
                    console.log("removing dead creep " + name);
                }
            }
        }
    },
    // decides if the position is safe for n tiles around, returns the number of threats
    safePos: function(p, r, n) {
        const looplength = (n+1)*(n+1);
        var ret = 0;
        for (var k = 0; k < looplength; k++) {
            const kx = (k % (n+1)) - (n-1);
            const ky = Math.floor(k / (n+1)) - (n-1);
            const testpos = new RoomPosition(p.x+kx, p.y+ky, r.name);
            r.lookAt(testpos).forEach(function(obj) {
                if ((obj.type == LOOK_CREEPS) && (!obj.creep.my)) {
                    ret += 1;
                }
            });
        }
        return ret;
    }
}

module.exports = utilHelp;
