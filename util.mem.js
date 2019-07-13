var utilMem = {
    init: function() {
        Memory.level = 0;
        Game.spawns['Spawn1'].memory = { "level" : 1, "ext" : [], "controllercon" : 0, "resourcecon" : 0 };
        Game.spawns['Spawn1'].room.memory = { "sourceid" : [], "maxnharvs" : [], "nharvs" : [] };
        const terrain = Game.spawns['Spawn1'].room.getTerrain();
        var sources = Game.spawns['Spawn1'].room.find(FIND_SOURCES);
        for (var i in sources) {
            var n = 0;
            var x = sources[i].pos.x;
            var y = sources[i].pos.y;
            if (!terrain.get((x+1), (y-1))) {
                n += 1;
            }
            if (!terrain.get((x+1), y)) {
                n += 1;
            }
            if (!terrain.get((x+1), (y+1))) {
                n += 1;
            }
            if (!terrain.get(x, (y-1))) {
                n += 1;
            }
            if (!terrain.get(x, (y+1))) {
                n += 1;
            }
            if (!terrain.get((x-1), (y-1))) {
                n += 1;
            }
            if (!terrain.get((x-1), y)) {
                n += 1;
            }
            if (!terrain.get((x-1), (y+1))) {
                n += 1;
            }
            Game.spawns['Spawn1'].room.memory.sourceid[i] = sources[i].id;
            Game.spawns['Spawn1'].room.memory.maxnharvs[i] = n;
            Game.spawns['Spawn1'].room.memory.nharvs[i] = 0;
        }
    }
}

module.exports = utilMem;
