// some random init scripts
var utilInit = {
    //sets the source info for the creeps
    initSpawn: function(s) {
        const spawn = Game.getObjectById(s);
        if (spawn == null) {
            console.log("ERR: no spawns");
        }
        spawn.room.memory = { "sourceid" : [], "maxnharvs" : [], "nharvs" : [] };
        const terrain = spawn.room.getTerrain();
        var sources = spawn.room.find(FIND_SOURCES);
        if (sources.length) {
            for (var i in sources) {
                var n = 0;
                var x = sources[i].pos.x;
                var y = sources[i].pos.y;
                if (!terrain.get((x+1),(y-1))) {
                    n += 1;
                }
                if (!terrain.get((x+1),y)) {
                    n += 1;
                }
                if (!terrain.get((x+1),(y+1))) {
                    n += 1;
                }
                if (!terrain.get(x,(y-1))) {
                    n += 1;
                }
                if (!terrain.get(x,(y+1))) {
                    n += 1;
                }
                if (!terrain.get((x-1),(y-1))) {
                    n += 1;
                }
                if (!terrain.get((x-1),y)) {
                    n += 1;
                }
                if (!terrain.get((x-1),(y+1))) {
                    n += 1;
                }
                spawn.room.memory.sourceid[i] = sources[i].id;
                spawn.room.memory.maxnharvs[i] = n;
                spawn.room.memory.nharvs[i] = 0;
            }
        }
        else {
            console.log("ERR: no sources found");
            return 0;
        }
        spawn.memory.ext = [];
        spawn.memory.towers = [];
        spawn.memory.extcon = 0;
        spawn.memory.contcon = 0;
        spawn.memory.spawncon = 0;
        spawn.memory.sourcecon = 0;
        spawn.memory.selfcon = 0;
        return 1;
    }
}

module.exports = utilInit
