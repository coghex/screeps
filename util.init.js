// some random init scripts
var utilInit = {
    //sets the source info for the creeps
    initSpawn: function(spawn) {
        spawn.room.memory = { "sourceid" : [], "maxnharvs" : [], "nharvs" : [] };
        const terrain = spawn.room.getTerrain();
        var sources = spawn.room.find(FIND_SOURCES);
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
}

module.exports = utilInit
