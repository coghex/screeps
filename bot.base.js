var botBase = {
    run: function(s) {
        function buildExt(n, r, x, y) {
            var nx = (n % 3)-1;
            var ny = (n / 3)-1;
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
                console.log("successfully blueprinted extension at: " + (x+nx) + ", " + (y+ny));
                return;
            }
            else {
                return;
            }
        }
        function buildRoad(r, x, y) {
            var err = r.createConstructionSite(x,y,STRUCTURE_ROAD);
            if (err=(0)) {
                console.log("successfullty blueprinted road at: " + x + ", " + y);
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
                r.createConstructionSite(path[i].x, path[i].y, STRUCTURE_ROAD);
            }
            s.memory.controllercon = path.length;
        }
        function roadSpawnToSource(s, r) {
            var sloc = s.pos;
            var cloc = r.find(FIND_SOURCES);
            for (var i in cloc) {
                path = r.findPath(sloc, cloc[i], {ignoreCreeps: true, ignoreDestructableStructures: true, ignoreRoads: true});
                for (var j in path) {
                    r.createConstructionSite(path[i].x, path[i].y, STRUCTURE_ROAD);
                }
            }
        }
        function roadSourceToController(s, r) {
            var sloc = r.controller.pos;
            var cloc = r.find(FIND_SOURCES);
            for (var i in cloc) {
                path = r.findPath(sloc, cloc[i], {ignoreCreeps: true, ignoreDestructableStructures: true, ignoreRoads: true});
                for (var j in path) {
                    r.createConstructionSite(path[i].x, path[i].y, STRUCTURE_ROAD);
                }
            }
        }
        var r = s.room;
        var nextensions = s.memory.ext.length;
        if (Game.time < 100) {
            //console.log("too early to extend");
        }
        else if (s.room.energyAvailable < (s.room.energyCapacityAvailable-100)) {
            //console.log("no need to extend yet");
        }
        else if (nextensions < 9) {
            //console.log("no extensions yet, lets see if we can...");
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
        else if (!s.memory.controllercon) {
            roadSpawnToController(s, r);
            roadSpawnToSource(s, r);
            roadSourceToController(s, r);
        }
        else {
            //console.log("no roads needed");
        }
    }
}

module.exports = botBase;
