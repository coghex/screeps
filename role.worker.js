var utilHelp = require("util.help");
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
            const powerneed = creep.room.energyCapacityAvailable - creep.room.energyAvailable;
            const buildtargets = creep.room.find(FIND_CONSTRUCTION_SITES);
            const buildneed = buildtargets.length;
            const repairtargets = creep.room.find(FIND_STRUCTURES, {
                filter: object => object.hits < (object.hitsMax-1000)
            });
            const repairneed = repairtargets.length;
            
            const utilscore = creep.memory.utility + 10;
            var harvscore = 100/(1+nharv/2);
            //var ldhvscore = 100/nldhv;
            var upgdscore = 100/(1+nupgd/2);
            var bldrscore = 100/(1+nbldr/2);
            //var ldbdscore = 100/nldbd;
            var reprscore = 100/(1+nrepr/2);
            //var gbgcscore = 100/ngbgd;
            //var ldgcscore = 100/nldgc;
            if (powerneed < 40) {
                harvscore = 5;
                upgdscore += 10;
                bldrscore += 10;
            }
            else {
                harvscore += 60;
                upgdscore -=10;
                bldrscore -= 10;
            }
            if (buildneed > 0) {
                bldrscore += 60;
            }
            else {
                bldrscore = 5;
            }
            if (repairneed > 0) {
                reprscore += 60;
            }
            else {
                reprscore = 5;
            }
            if (nharv == 0) {
                harvscore += 100;
            }
            const maxscore = Math.max(utilscore, harvscore, upgdscore, bldrscore, reprscore);
            if (maxscore != utilscore) {
                if (maxscore == harvscore) {
                    creep.memory.job = "harv";
                    creep.memory.utility = harvscore+10;
                }
                else if (maxscore == upgdscore) {
                    creep.memory.job = "upgd";
                    creep.memory.utility = upgdscore+10;
                }
                else if (maxscore == bldrscore) {
                    creep.memory.job = "bldr";
                    creep.memory.utility = bldrscore+10;
                }
                else if (maxscore == reprscore) {
                    creep.memory.job = "repr";
                    creep.memory.utility = reprscore+10;
                }
                else {
                    console.log("ERR: could not find best score");
                }
            }
        }
        if (creep.memory.utility < 0) {
            creep.memory.job = "null";
            creep.memory.utility = -100;
        }
        if (creep.memory.utility > 100) {
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
                    utilHelp.creepGetEnergy(creep);
                }
                else {
                    utilHelp.creepTransferToStructure(creep);
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
                    utilHelp.creepGetEnergy(creep);
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
                    utilHelp.creepBuild(creep);
                }
                else {
                    utilHelp.creepGetEnergy(creep)
                }
                
                break;
            case "repr":
                break;
            // dont let it get here
            default:
                console.log("ERR: creep job " + creep.memory.job + " not defined");
        }
    }
}

module.exports = roleWorker;
