var roleTower = {
    run: function(t) {
        var tower = Game.getObjectById(t);
        if (tower) {
            var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (struct) => (struct.hits < (struct.hitsMax-10))
            });
            if (closestDamagedStructure) {
                tower.repair(closestDamagedStructure);
            }
            var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if (closestHostile) {
                tower.attack(closestHostile);
            }
        }
    }
}

module.exports = roleTower;
