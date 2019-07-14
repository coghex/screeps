var botBase = {
    run: function(s) {
        function buildExt(n, r, x, y) {
            var extlev = s.memory.level;
            var nx = (n % (extlev*3))-extlev;
            var ny = (n / (extlev*3))-extlev;
            var err = r.createConstructionSite(x+nx,y+ny,STRUCTURE_EXTENSION);
            if (n > 10) {
                return;
            }
            if (err==(-14)) {
                //console.log("not ready for extensions yet");
            }
            else if (err==(-7)) {
                //console.log("cant build at " + x + ", " + y + " trying next location...");
                buildExt((n+1), r, x, y);
            }
            else if (err==0) {
                s.memory.ext.push({ex: x, ey: y});
                //console.log("successfully blueprinted extension at: " + (x+nx) + ", " + (y+ny));
                return;
            }
            else {
                return;
            }
        }
        function buildRoad(r, x, y) {
            var err = r.createConstructionSite(x,y,STRUCTURE_ROAD);
            if (err=(0)) {
                //console.log("successfullty blueprinted road at: " + x + ", " + y);
            }
        }
        function buildRoads(n, s, r) {
            var nx = (n % 3)-1;
            var ny = (n / 3)-1;
            var x = s.pos.x+nx;
            var y = s.pos.y+ny;
            buildRoad(r, x, y);
        }
        function roadSpawnToController(s, r) {
            var sloc = s.pos;
            var cloc = r.controller.pos;
            var path = r.findPath(sloc, cloc, {ignoreCreeps: true, ignoreDestructableStructures: true, ignoreRoads: true});
            for (var i in path) {
                var ret = 0;
                var pos = new RoomPosition(path[i].x, path[i].y, r.name);
                r.lookAt(pos).forEach(function(object) {
                    if ((object.type == LOOK_STRUCTURES)) {
                        ret += 1;
                    }
                });
                if (ret == 0) {
                    r.createConstructionSite(path[i].x, path[i].y, STRUCTURE_ROAD);
                }
            }
            s.memory.controllercon = path.length;
        }
        function roadSpawnToSource(n, s, r) {
            var sloc = s.pos;
            var cloc = r.find(FIND_SOURCES);
            for (var i in cloc) {
                if (i > s.memory.sourcen) {
                    break;
                }
                var enemy = 0;
                for (var k = 0; k < 26; k++) {
                    var kx = (k % 6) - 2;
                    var ky = (k / 6) - 2;
                    var pos = new RoomPosition(sloc.x+kx, sloc.y+ky, r.name);
                    r.lookAt(pos).forEach(function(object) {
                        if ((object.type == LOOK_CREEPS) && (!object.creep.my)) {
                            enemy += 1;
                        }
                    });
                }
                if (!enemy) {
                    var path = r.findPath(sloc, cloc[i], {ignoreCreeps: true, ignoreDestructableStructures: true, ignoreRoads: true});
                    for (var j in path) {
                        var ret = 0;
                        var pos = new RoomPosition(path[j].x, path[j].y, r.name);
                        r.lookAt(pos).forEach(function(object) {
                            if ((object.type == LOOK_STRUCTURES)) {
                                ret += 1;
                            }
                        });
                        if (ret == 0) {
                            r.createConstructionSite(path[j].x, path[j].y, STRUCTURE_ROAD);
                        }
                    }
                }
            }
        }
        function roadSourceToController(s, r) {
            const sloc = r.controller.pos;
            const cloc = r.find(FIND_SOURCES);
            for (var i in cloc) {
                var path = r.findPath(sloc, cloc[i], {ignoreCreeps: true, ignoreDestructableStructures: true, ignoreRoads: true});
                for (var j in path) {
                    var ret = 0;
                    var pos = new RoomPosition(path[j].x, path[j].y, r.name);
                    r.lookAt(pos).forEach(function(object) {
                        if ((object.type== LOOK_STRUCTURES)) {
                            ret += 1;
                        }
                    });
                    if (ret == 0) {
                        r.createConstructionSite(path[j].x, path[j].y, STRUCTURE_ROAD);
                    }
                }
            }
        }
        function setNHarv(r, sources, i) {
            var ret = 0;
            if (i) {
                for (var name in Game.creeps) {
                    var creep = Game.creeps[name];
                    if(creep.memory.dest == i) {
                        ret += 1;
                    }
                }
            }
            r.memory.nharvs[i] = ret;
        }
        var r = s.room;
        var sources = r.find(FIND_SOURCES);
        for (var i in sources) {
            setNHarv(r, sources, i)
        }
        var nextensions = s.memory.ext.length;
        if (Game.time < 100) {
            //console.log("too early to extend");
        }
        else if (s.room.energyAvailable < (s.room.energyCapacityAvailable-100)) {
            //console.log("no need to extend yet");
        }
        else if (nextensions < 5) {
            //console.log("no extensions yet, lets see if we can...");
            buildExt(nextensions, r, s.pos.x, s.pos.y);
        }
        if (r.controller.level == 3 && nextensions <= 5) {
            buildExt(nextensions, r, s.pos.x, s.pos.y);
        }
        var roads = r.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_ROAD);
            }
        });
        if (roads.length < 9) {
            buildRoads((roads.length), s, r);
        }
        else if ((Game.time % 10000) && (!s.memory.controllercon)) {
            roadSpawnToController(s, r);
        }
        else if ((Game.time % 13000) && (s.memory.controllercon) && (!s.memory.spawncon)) {
            roadSpawnToSource(s.memory.sourcen, s, r);
            s.memory.sourcen += 1;
        }
        else if ((Game.time % 15000) && (s.memory.controllercon) && (s.memory.spawncon) && (!s.memory.sourcecon)) {
            roadSourceToController(s, r);
        }
        else {
            //console.log("no roads needed");
        }
        if ((roads.length > 10) && (r.find(FIND_MY_CONSTRUCTION_SITES).length == 0)) {
            if (!s.memory.controllercon) {
                s.memory.controllercon = 1;
            }
            else if (!s.memory.spawncon) {
                s.memory.spawncon = 1;
            }
            else if (!s.memory.sourcecon) {
                s.memory.sourcecon = 1;
            }
        }
    }
}

module.exports = botBase;
