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
    },
    //sets pathing info
    initPath: function(s) {
        const spawn = Game.getObjectById(s);
        if (spawn != null) {
            const room = spawn.room;
            const sources = room.find(FIND_SOURCES);
            const cont = room.controller;
            //const exits = [(), (), (), ()]
            room.memory.paths = [];
            room.memory.pathstarts = [];
            room.memory.pathdests = [cont.pos, spawn.pos];
            for (var i in sources) {
                room.memory.pathdests.push(sources[i].pos);
            }
            for (var j in room.memory.pathdests) {
                for (var k in room.memory.pathdests) {
                    if (j != k) {
                        var path = room.memory.pathdests[j].findPathTo(room.memory.pathdests[k]).slice(2);
                        path.pop().pop();
                        room.memory.paths.push(path);
                        room.memory.pathstarts.push(path[0]);
                    }
                }
            }
        }
    }
}

module.exports = utilInit
