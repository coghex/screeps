var utilHelp = require("util.help");
//builds roads needed for spawn activity
var botBase = {
    run: function(s) {
        if (!(Game.time % 121)) {
            const r = s.room;
            var next = r.find(FIND_STRUCTURES, {
                filter: (struct) => (struct.structureType == STRUCTURE_EXTENSION)
            });
            var nextcon = r.find(FIND_MY_CONSTRUCTION_SITES, {
                filter: (site) => (site.structureType == STRUCTURE_EXTENSION)
            });
            //if (s.room.energyAvailable < (s.room.energyCapacityAvailable)) {
                //console.log("no need to extend");
            //}
            if (nextcon.length) {
                //console.log("already working on an extension");
            }
            else if (r.controller.level < 2) {
                //console.log("too early to build");
            }
            else {
                utilHelp.buildExt(next.length, r, s, r.controller.level);
            }
        }
        if (!(Game.time % 100)) {
            const r = s.room;
            var roads = r.find(FIND_STRUCTURES, {
                filter: (struct) => (struct.structureType == STRUCTURE_ROAD)
            });
            var roadcons = r.find(FIND_MY_CONSTRUCTION_SITES, {
                filter: (site) => (site.structureType == STRUCTURE_ROAD)
            });
            if (roadcons.length == 0) {
                if ((r.controller.level >= 2) && (!s.memory.con)) {
                    if (Memory.debug > 2) {
                        //console.log("building roads around the spawn...");
                        console.log ("initializing construction...");
                    }
                    //utilHelp.buildExtRoads(0, s, r);
                    s.memory.con = 1;
                }
                else if ((s.memory.con) && (!s.memory.contcon)) {
                    if (Memory.debug > 2) {
                        console.log("building a road to the controller...");
                    }
                    utilHelp.buildExtRoads(r);
                    utilHelp.buildRoadSpawnToController(s, r);
                    s.memory.contcon = 1;
                }
                else if ((s.memory.contcon) && (!s.memory.spawncon)) {
                    if (Memory.debug > 2) {
                        console.log("building roads to the spawns...");
                    }
                    utilHelp.buildExtRoads(r);
                    utilHelp.buildRoadSpawnToSource(s, r);
                    s.memory.spawncon = 1;
                }
                else if ((s.memory.spawncon) && (!s.memory.sourcecon)) {
                    if (Memory.debug > 2) {
                        console.log("building roads to the controller...");
                    }
                    utilHelp.buildExtRoads(r);
                    utilHelp.buildRoadSourceToController(s, r);
                    s.memory.sourcecon = 1;
                }
            }
        }
    }
}

module.exports = botBase;
