var utilHelp = require('util.help');
var roleTower = require('role.tower');
//builds roads needed for spawn activity
var botBase = {
    run: function(s) {
        const spawn = Game.getObjectById(s);
        //runs any towers on the map
        for (var i in spawn.memory.towers) {
            roleTower.run(spawn.memory.towers[i].id);
        }
        const r = spawn.room;
        //this is the extension builder
        if (!(Game.time % 171)) {
            var extlen = spawn.memory.ext.length;
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
                utilHelp.buildExt(extlen, s, r.controller.level);
            }
        }
        //this is the tower builder
        if ((spawn.room.controller.level >= 3) && (!(Game.time % 138))) {
            var ntowers = r.find(FIND_STRUCTURES, {
                filter: (struct) => (struct.structureType == STRUCTURE_TOWER)
            });
            var ntowercon = r.find(FIND_MY_CONSTRUCTION_SITES, {
                filter: (site) => (site.structureType == STRUCTURE_TOWER)
            });
            if (ntowercon.length) {
                //console.log("already working on a tower");
            }
            else {
                utilHelp.buildTower(ntowers, s, r.controller.level);
            }
        }
        //this is the road builder
        if (!(Game.time % 100)) {
            var roads = r.find(FIND_STRUCTURES, {
                filter: (struct) => (struct.structureType == STRUCTURE_ROAD)
            });
            var roadcons = r.find(FIND_MY_CONSTRUCTION_SITES, {
                filter: (site) => (site.structureType == STRUCTURE_ROAD)
            });
            if (roadcons.length == 0) {
                if ((r.controller.level >= 2) && (!spawn.memory.con)) {
                    if (Memory.debug > 2) {
                        //console.log("building roads around the spawn...");
                        console.log ("initializing construction...");
                    }
                    //utilHelp.buildExtRoads(0, s, r);
                    spawn.memory.con = 1;
                }
                else if ((spawn.memory.con) && (!spawn.memory.contcon)) {
                    if (Memory.debug > 2) {
                        console.log("building a road to the controller...");
                    }
                    utilHelp.buildExtRoads(s);
                    utilHelp.buildRoadSpawnToController(s);
                    spawn.memory.contcon = 1;
                }
                else if ((spawn.memory.contcon) && (!spawn.memory.spawncon)) {
                    if (Memory.debug > 2) {
                        console.log("building roads to the spawns...");
                    }
                    utilHelp.buildExtRoads(s);
                    utilHelp.buildRoadSpawnToController(s);
                    utilHelp.buildRoadSpawnToSource(s);
                    spawn.memory.spawncon = 1;
                }
                else if ((spawn.memory.spawncon) && (!spawn.memory.sourcecon)) {
                    if (Memory.debug > 2) {
                        console.log("building roads to the controller...");
                    }
                    utilHelp.buildExtRoads(s);
                    utilHelp.buildRoadSpawnToController(s);
                    utilHelp.buildRoadSpawnToSource(s);
                    utilHelp.buildRoadSourceToController(s);
                    spawn.memory.sourcecon = 1;
                }
                else if ((spawn.memory.sourcecon) && (!spawn.memory.selfcon)) {
                    if (Memory.debug > 2) {
                        console.log("building roads around the spawn, sources, and the controller...");
                    }
                    utilHelp.buildExtRoads(s);
                    utilHelp.buildRoadsAroundPos(0,s,r.controller.pos,2);
                    utilHelp.buildRoadsAroundPos(0,s,spawn.pos,2);
                    var sources = r.find(FIND_SOURCES);
                    for (var i in sources) {
                        utilHelp.buildRoadsAroundPos(0,s,sources[i].pos,2);
                    }
                    spawn.memory.selfcon = 1;
                }
            }
        }
    }
}

module.exports = botBase;
