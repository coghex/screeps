var utilHelp = require('util.help');
var utilCreep = require('util.creep');
// the worker is the standard citizen of the empire
var roleWorker = {
    run: function(creep) {
        var arr = [];
        for (const i in Game.creeps) {
            if (Game.creeps[i].memory.job != null) {
                arr.push(Game.creeps[i].memory.job);
            }
            else if (!Memory.halt) {
                console.log("ERR: creep has no job memory!");
                Memory.halt = 1;
            }
        }
        const nharv = arr.filter(j => (j == "harv")).length;
        //const nldhv = arr.filter(j => (j == "ldhv")).length;
        const nupgd = arr.filter(j => (j == "upgd")).length;
        const nbldr = arr.filter(j => (j == "bldr")).length;
        //const nldbd = arr.filter(j => (j == "ldbd")).length;
        const nrepr = arr.filter(j => (j == "repr")).length;
        //const ngbgc = arr.filter(j => (j == "gbgc")).length;
        //const nldgc = arr.filter(j => (j == "ldgc")).length;
        const nflee = arr.filter(j => (j == "flee")).length;
        const nnull = arr.filter(j => (j == "null")).length;

        //every tick has a random chance of changing the job of a harvester,
        //unless its null, then it automatically picks one.
        const rand = Math.floor(Math.random()*10);
        if ((creep.memory.job == "null") || ((Game.time % 10) == rand)) {
            if ((creep.hits < creep.hitsMax) && (creep.memory.job != "flee")) {
                creep.memory.job = "flee";
                creep.memory.utility = 100;
            }
            else {
                const powerneed = creep.room.energyCapacityAvailable - creep.room.energyAvailable;
                const buildtargets = creep.room.find(FIND_CONSTRUCTION_SITES);
                const buildneed = buildtargets.length;
                const repairtargets = creep.room.find(FIND_STRUCTURES, {
                    filter: object => object.hits < (object.hitsMax-1000)
                });
                const repairneed = repairtargets.length;
                const spawns = creep.room.find(FIND_STRUCTURES, {
                    filter: (struct) => (struct.structureType == STRUCTURE_SPAWN)
                });
                // dont count yourself when finding work
                var meharv = 0;
                var meupgd = 0;
                var mebldr = 0;
                var merepr = 0;
                if (creep.memory.job == "harv") {
                    meharv = 1;
                }
                if (creep.memory.job == "upgd") {
                    meupgd = 1;
                }
                if (creep.memory.job == "bldr") {
                    mebldr = 1;
                }
                if (creep.memory.job == "repr") {
                    merepr = 1;
                }
                const utilscore = creep.memory.utility + 12;
                var harvscore = 100/(1+(nharv-meharv)/(2*spawns[0].memory.level));
                //var ldhvscore = 100/nldhv;
                var upgdscore = 100/(1+(nupgd-meupgd)/(2*spawns[0].memory.level));
                var bldrscore = 100/(1+(nbldr-mebldr)/(2*spawns[0].memory.level));
                //var ldbdscore = 100/nldbd;
                var reprscore = 100/(1+(nrepr-merepr)/(2*spawns[0].memory.level));
                //var gbgcscore = 100/ngbgd;
                //var ldgcscore = 100/nldgc;
                if (!powerneed) {
                    harvscore = 2;
                    upgdscore += 20;
                    bldrscore += 20;
                }
                else {
                    harvscore += 60;
                    upgdscore -= 10;
                    bldrscore -= 10;
                }
                if (buildneed > 0) {
                    bldrscore += 40;
                }
                else {
                    upgdscore += 40;
                    bldrscore = 2;
                }
                if (repairneed > 0) {
                    reprscore += 40;
                }
                else {
                    upgdscore += 20;
                    reprscore = 2;
                }
                const maxscore = Math.max(utilscore, harvscore, upgdscore, bldrscore, reprscore);
                if (maxscore != utilscore) {
                    if (maxscore == harvscore) {
                        creep.memory.job = "harv";
                        creep.memory.utility = harvscore+60;
                    }
                    else if (maxscore == upgdscore) {
                        creep.memory.job = "upgd";
                        creep.memory.utility = upgdscore+60;
                    }
                    else if (maxscore == bldrscore) {
                        creep.memory.job = "bldr";
                        creep.memory.utility = bldrscore+60;
                    }
                    else if (maxscore == reprscore) {
                        creep.memory.job = "repr";
                        creep.memory.utility = reprscore+60;
                    }
                    else {
                        console.log("ERR: could not find best score");
                    }
                }
            }
        }
        else if (creep.memory.utility < 0) {
            creep.memory.job = "null";
            creep.memory.utility = -100;
        }
        else if (creep.memory.utility > 100) {
            creep.memory.utility = 100;
        }

        //creeps lose utility
        creep.memory.utility -= 1;

        //these are the jobs a worker can have
        switch (creep.memory.job) {
            // if the creep is fleeing they will try and return to the spawn
            case "flee":
                creep.memory.utility += 1;
                var spawn = creep.room.find(FIND_STRUCTURES, {
                    filter: (struct) => (struct.structureType == STRUCTURE_SPAWN)
                });
                creep.drop(RESOURCE_ENERGY);
                creep.moveTo(Game.spawns['Spawn1'].pos);
                break;
            // harvesters find energy and bring it to structures that want it
            case "harv":
                if (creep.memory.harvesting && creep.carry.energy == 0) {
                    creep.memory.harvesting = false;
                }
                if (!creep.memory.harvesting && (creep.carry.energy >= (creep.carryCapacity))) {
                    creep.memory.harvesting = true;
                }
                if (!creep.memory.harvesting) {
                    utilCreep.creepGetEnergy(creep);
                }
                else {
                    utilCreep.creepTransferToStructure(creep);
                }
                break;
            // upgraders find energy and use it to upgrade the room's controller
            case "upgd":
                if (creep.memory.upgrading && creep.carry.energy == 0) {
                    creep.memory.upgrading = false;
                }
                if (!creep.memory.upgrading && (creep.carry.energy >= (creep.carryCapacity))) {
                    creep.memory.upgrading = true;
                }
                if (creep.memory.upgrading) {
                    if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(creep.room.controller);
                    }
                    else {
                        creep.memory.dest = null;
                        creep.memory.utility += 2;
                    }
                }
                else {
                    utilCreep.creepGetEnergy(creep);
                }
                break;
            case "bldr":
                if (creep.memory.building && creep.carry.energy == 0) {
                    creep.memory.building = false;
                }
                if (!creep.memory.building && ((creep.carry.energy >= (creep.carryCapacity)))) {
                    creep.memory.building = true;
                }
                if (creep.memory.building) {
                    utilCreep.creepBuild(creep);
                }
                else {
                    utilCreep.creepGetEnergy(creep);
                }
                
                break;
            case "repr":
                if (creep.memory.repairing && creep.carry.energy == 0) {
                    creep.memory.repairing = false;
                }
                if (!creep.memory.repairing && creep.carry.energy == creep.carryCapacity) {
                    creep.memory.repairing = true;
                }
                if (creep.memeory.repairing) {
                    utilCreep.creepRepair(creep);
                }
                else {
                    utilCreep.creepGetEnergy(creep);
                }
                break;
            // dont let it get here
            default:
                console.log("ERR: creep job " + creep.memory.job + " not defined");
        }
    }
}

module.exports = roleWorker;
