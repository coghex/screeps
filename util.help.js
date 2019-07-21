//random helper functions
var utilHelp = {
    // decides if the position is safe for n tiles around, returns the number of threats
    safePos: function(p, s, n) {
        const spawn = Game.getObjectById(s);
        const r = spawn.room;
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
    },
    // creates the construction site for the tower
    buildTower: function(n, s, lvl) {
        const spawn = Game.getObjectById(s);
        const r = spawn.room;
        const nx = (n % (2*lvl-1)) - (lvl-1);
        const ny = Math.floor((n / (2*lvl-1))) - (lvl-1);
        const x = spawn.pos.x+nx;
        const y = spawn.pos.y+ny;
        const err = r.createConstructionSite(x, y, STRUCTURE_TOWER);
        if (n > 50) {
            console.log("ERR: couldnt place tower");
            return;
        }
        if ((err==(-8)) || (err==(-14))) {
            if (Memory.debug > 3) {
                console.log("not ready for towers yet");
            }
        }
        else if ((err==(-7)) || (err==(-10))) {
            if (Memory.debug > 3) {
                console.log("cant build at " + x + ", " + y + "... trying next location");
            } 
            utilHelp.buildTower((n+2),r,s,lvl);
        }
        else if (err==0) {
            if (Memory.debug > 2) {
                console.log("tower built at " + x + ", " + y);
            }
            spawn.memory.towers.push({tx: x, ty: y});
        }
        else {
            console.log("ERR: undefined api error");
        }
    },
    // creates the construction site for the extensions
    buildExt: function(n, s, lvl) {
        const spawn = Game.getObjectById(s);
        const r = spawn.room;
        const nx = (n % (2*lvl-1)) - (lvl-1);
        const ny = Math.floor((n / (2*lvl-1))) - (lvl-1);
        const x = spawn.pos.x+nx;
        const y = spawn.pos.y+ny;
        const err = r.createConstructionSite(x, y, STRUCTURE_EXTENSION);
        if (n > 50) {
            console.log("ERR: couldnt place extension");
            return;
        }
        if ((err==(-8)) || (err==(-14))) {
            if (Memory.debug > 3) {
                console.log("not ready for extensions yet");
            }
        }
        else if ((err==(-7)) || (err==(-10))) {
            if (Memory.debug > 3) {
                console.log("cant build at " + x + ", " + y + "... trying next location");
            }
            if (lvl <= 2) {
                utilHelp.buildExt((n+1),s,lvl);
            }
            else {
                utilHelp.buildExt((n+2),s,lvl);
            }
        }
        else if (err==0) {
            if (Memory.debug > 3) {
                console.log("extension built at " + x + ", " + y);
            }
            spawn.memory.ext.push({ex: x, ey: y});
        }
        else {
            console.log("ERR: undefined api error");
        }
    },
    // builds roads in a radius around the position
    buildRoadsAroundPos(n,s,p,rad) {
        const spawn = Game.getObjectById(s);
        const r = spawn.room;
        if (n >= ((2*rad+1)*(2*rad+1))) {
            return;
        }
        if (r.lookForAt(LOOK_WALL, p).length) {
            var nx = (n % (2*rad+1)) - (rad);
            var ny = Math.floor(n / (2*rad+1)) - (rad);
            utilHelp.buildRoad(s, p.x+nx, p.y+ny);
        }
        utilHelp.buildRoadsAroundPos((n+1),s,p,rad);
    },
    // builds roads around the spawn and extensions
    buildExtRoads: function(s) {
        const spawn = Game.getObjectById(s);
        const room = spawn.room;
        const exts = room.find(FIND_STRUCTURES, {
            filter: (struct) => (struct == STRUCTURE_EXTENSION)
        });
        for (var i in exts) {
            utilHelp.buildRoad(s, exts[i].pos.x, exts[i].pos.y);
        }
    },
    // builds a road at x, y in a room
    buildRoad: function(s, x, y) {
        const spawn = Game.getObjectById(s);
        const room = spawn.room;
        const err = room.createConstructionSite(x,y,STRUCTURE_ROAD);
        if (err == 0) {
            //console.log("successfully blueprinted road at: " + x + ", " + y);
        }
        else {
            //console.log("cant build road at: " + x + ", " + y);
        }
    },
    // builds a road from the spawn to the controller
    buildRoadSpawnToController: function(s) {
        const spawn = Game.getObjectById(s);
        const r = spawn.room;
        const sloc = spawn.pos;
        const cloc = r.controller.pos;
        const path = r.findPath(sloc, cloc, {ignoreCreeps: true}).slice(1);
        for (var i in (path)) {
            var ret = 0;
            var pos = new RoomPosition(path[i].x, path[i].y, r.name);
            if (pos != null) {
                r.lookAt(pos).forEach(function(obj) {
                    if ((obj.type == LOOK_STRUCTURES)) {
                        ret += 1;
                    }
                });
                if (ret == 0) {
                    r.createConstructionSite(path[i].x, path[i].y, STRUCTURE_ROAD);
                }
            }
        }
    },
    // roads from the spawn to each source
    buildRoadSpawnToSource: function(s) {
        const spawn = Game.getObjectById(s);
        const r = spawn.room;
        const sloc = spawn.pos;
        const cloc = r.find(FIND_SOURCES);
        for (var i in cloc) {
            const notsafe = utilHelp.safePos(cloc[i].pos, s, 2);
            if (!notsafe) {
                var path = r.findPath(sloc, cloc[i].pos, {ignoreCreeps: true}).slice(1);
                path.pop();
                for (var j in (path)) {
                    var ret = 0;
                    var pos = new RoomPosition(path[j].x, path[j].y, r.name);
                    if (pos != null) {
                        r.lookAt(pos).forEach(function(obj) {
                            if ((obj.type == LOOK_STRUCTURES)) {
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
    },
    // roads from the controller to each source
    buildRoadSourceToController: function(s) {
        const spawn = Game.getObjectById(s);
        const r = spawn.room;
        const sloc = r.controller.pos;
        const cloc = r.find(FIND_SOURCES);
        for (var i in cloc) {
            const notsafe = utilHelp.safePos(cloc[i].pos, s, 2);
            if (!notsafe) {
                var path = r.findPath(sloc, cloc[i],pos, {ignoreCreeps: true}).slice(1);
                path.pop();
                for (var j in (path)) {
                    var ret = 0;
                    var pos = new RoomPosition(path[j].x, path[j].y, r.name);
                    if (pos != null) {
                        r.lookAt(pos).forEach(function(obj) {
                            if (!obj.type == LOOK_STRUCTURES) {
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
    },
    // sets the number of harvesters around a source
    setNHarv: function(s, i) {
        const spawn = Game.getObjectById(s);
        const room = spawn.room;
        var ret = 0;
        if (i) {
            for (var name in Game.creeps) {
                const creep = Game.creeps[name];
                if (creep.memory.dest == i) {
                    ret += 1;
                }
            }
        }
        room.memory.nharvs[i] = ret;
    }
}

module.exports = utilHelp;
