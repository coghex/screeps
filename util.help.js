//random helper functions
var utilHelp = {
    // collects creep name garbage every 24 ticks
    freeCreepMemory: function() {
        if (!(Game.time % 24)) {
            for (var name in Memory.creeps) {
                if (!Game.creeps[name]) {
                    delete Memory.creeps[name];
                    if (Memory.debug > 2) {
                        console.log("removing dead creep " + name);
                    }
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
    },
    // causes a creep to look for the nearest source and harvest it
    creepGetEnergy: function(creep) {
        const sources = creep.room.find(FIND_SOURCES);
        if (creep.memory.dest == null) {
            var source = sources[0];
            var minlength = 100;
            for (var i in sources) {
                const length = creep.pos.findPathTo(sources[i].pos).length;
                if (length < minlength) {
                    if (creep.room.memory.nharvs[i] < creep.room.memory.maxnharvs[i]) {
                        const ret = utilHelp.safePos(sources[i].pos, creep.room, 2);
                        if (ret == 0) {
                            source = sources[i];
                            minlength = length;
                            creep.memory.dest = i;
                        }
                    }
                }
            }
        }
        else {
            var source = sources[creep.memory.dest];
        }
        if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
            creep.moveTo(source);
        }
        else {
            creep.memory.utility += 1;
        }
    },
    // causes a creep to look for the nearest structure and transfers all energy to it
    creepTransferToStructure: function(creep) {
        var targets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN ||
                        structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
            }
        });
        if (targets.length) {
            if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0]);
            }
            else {
                creep.memory.utility += 20;
            }
        }
        else {
            creep.memory.job = "null";
            creep.memory.utility = -100;
        }
    },
    creepBuild: function(creep) {
        var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
        if (targets.length) {
            if (creep.memory.builddest != null) {
                var target = Game.getObjectById(creep.memory.builddest);
                if (target != null) {
                    if (creep.build(target) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                    }
                    else {
                        creep.memory.utility += 2;
                    }
                }
                else {
                    creep.memory.builddest = null;
                }
            }
            else {
                var mindist = 100;
                var shortest = 0;
                for (var i in targets) {
                    var path = creep.room.findPath(targets[i].pos, creep.pos);
                    if (targets[i].structureType == STRUCTURE_EXTENSION) {
                        mindist = path.length;
                        shortest = i
                        break;
                    }
                    else {
                        if (path.length < mindist) {
                            mindist = path.length;
                            shortest = i;
                        }
                    }
                }
                creep.memory.builddest = targets[shortest].id;
                if (creep.build(targets[shortest]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[shortest]);
                }
                else {
                    creep.memory.utility += 2;
                }
            }
        }
        else {
            creep.memory.job = "null";
            creep.memory.utility = -100;
        }
    },
    // creates the construction site for the extensions
    buildExt: function(n, r, s, lvl) {
        const nx = (n % (2*lvl-1)) - (lvl-1);
        const ny = Math.floor((n / (2*lvl-1))) - (lvl-1);
        const x = s.pos.x+nx;
        const y = s.pos.y+ny;
        const err = r.createConstructionSite(x, y, STRUCTURE_EXTENSION);
        if (n > 50) {
            return;
        }
        if ((err==(-8)) || (err == (-14))) {
            console.log("not ready for extensions yet");
        }
        else if ((err == (-7)) || (err==(-10))) {
            if (Memory.debug > 3) {
                console.log("cant build at " + x + ", " + y + "... trying next location");
            }
            utilHelp.buildExt((n+1),r,s);
        }
        else if (err==0) {
            if (Memory.debug > 3) {
                console.log("extension built at " + x + ", " + y);
            }
            s.memory.ext.push({ex: x, ey: y});
        }
        else {
            console.log("ERR: undefined api error");
        }
    },
    // builds roads around the spawn and extensions
    buildExtRoads: function(r) {
        const exts = r.find(FIND_STRUCTURES, {
            filter: (struct) => (struct == STRUCTURE_EXTENSION || struct == STRUCTURE_SPAWN)
        });
        for (var i in exts) {
            utilHelp.buildRoad(r, exts[i].pos.x, exts[i].pos.y);
        }
    },
    // builds a road at x, y in a room
    buildRoad: function(r, x, y) {
        const err = r.createConstructionSite(x,y,STRUCTURE_ROAD);
        if (err == 0) {
            //console.log("successfully blueprinted road at: " + x + ", " + y);
        }
        else {
            //console.log("cant build road at: " + x + ", " + y);
        }
    },
    // builds a road from the spawn to the controller
    buildRoadSpawnToController: function(s, r) {
        const sloc = s.pos;
        const cloc = r.controller.pos;
        const path = r.findPath(sloc, cloc, {ignoreCreeps: true, ignoreDestructableStructures: true, ignoreRoads: true});
        for (var i in path) {
            var ret = 0;
            var pos = new RoomPosition(path[i].x, path[i].y, r.name);
            r.lookAt(pos).forEach(function(obj) {
                if ((obj.type == LOOK_STRUCTURES)) {
                    ret += 1;
                }
            });
            if (ret == 0) {
                r.createConstructionSite(path[i].x, path[i].y, STRUCTURE_ROAD);
            }
        }
    },
    // roads from the spawn to each source
    buildRoadSpawnToSource: function(s, r) {
        const sloc = s.pos;
        const cloc = r.find(FIND_SOURCES);
        for (var i in cloc) {
            const notsafe = utilHelp.safePos(cloc[i], r, 4);
            if (!notsafe) {
                var path = r.findPath(sloc, cloc[i], {ignoreCreeps: true, ignoreDestructableStructures: true, ignoreRoads: true});
                for (var j in path) {
                    var ret = 0;
                    var pos = new RoomPosition(path[j].x, path[j].y, r.name);
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
    },
    // roads from the controller to each source
    buildRoadSourceToController: function(s, r) {
        const sloc = r.controller.pos;
        const cloc = r.find(FIND_SOURCES);
        for (var i in cloc) {
            const notsafe = utilHelp.safePos(cloc[i], r, 4);
            if (!notsafe) {
                var path = r.findPath(sloc, cloc[i], {ignoreCreeps: true, ignoreDestructableStructures: true, ignoreRoads: true});
                for (var j in path) {
                    var ret = 0;
                    var pos = new RoomPosition(path[j].x, path[j].y, r.name);
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
    },
    // sets the number of harvesters around a source
    setNHarv: function(r, sources, i) {
        var ret = 0;
        if (i) {
            for (var name in Game.creeps) {
                const creep = Game.creeps[name];
                if (creep.memory.dest == i) {
                    ret += 1;
                }
            }
        }
        r.memory.nharvs[i] = ret;
    }
}

module.exports = utilHelp;
