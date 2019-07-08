var botBase = {
    run: function(s) {
        function buildExt(n, r, x, y) {
            var name = "ext" + Game.time;
            var nx = (n % 3)-1
            var ny = (n / 3)-1
            var err = r.createConstructionSite(x+nx,y+ny,STRUCTURE_EXTENSION);
            if (err=(-14)) {
                //console.log("not ready for extensions yet");
            }
            else if (err=(-7)) {
                console.log("cant build at " + x + ", " + y + " trying next location...");
                buildExt((n+1), r, x, y);
            }
            else if (err=0) {
                s.mem.ext += (x, y);
                console.log("succesfully blueprinted extension at: " + x + ", " + y);
            }
            else {
                return;
            }
        }
        var r = s.room;
        var nextensions = s.memory.ext.length;
        if (Game.time < 100) {
            //console.log("too early to extend");
        }
        else if (s.energy < (s.energyCapacity-100)) {
            //console.log("no need to extend yet");
        }
        else if (nextensions == 0) {
            //console.log("no extensions yet, lets see if we can...");
            buildExt(nextensions, r, s.pos.x, s.pos.y);
        }
    }
}

module.exports = botBase;
