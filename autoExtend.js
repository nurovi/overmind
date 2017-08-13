// Get building type counts.
// Room name needs to be dynamic somehow.
var extensions = Game.rooms['sim'].find(STRUCTURE_EXTENSION).length;

// Extensions along with creep limits needs to be a dict based on controller level
if(extensions < 5) {
    var needToBuild = 5 - extensions;
    var x = Game.spawns['Spawn1'].pos.x;
    var y = Game.spawns['Spawn1'].pos.y;
    var dir = 0; // 0 up 1 right 2 down 3 left
    var count = 0;
    var length = 1;
    var loops = 0;
    
    while(count < needToBuild){
        for(var i = 0; i < length; i++){
            switch(dir){ //move
                case 0:
                    y = y + 1;
                    break;
                case 1:
                    x = x + 1;
                    break;
                case 2:
                    y = y - 1;
                    break;
                case 3: 
                    x = x - 1;
                    break;
            }
            Game.rooms['sim'].createConstructionSite(x, y, STRUCTURE_EXTENSION);
            count++;
        }
        dir = (dir+1)%4; //rotate
        loops++;     
        if (loops / 2 == 0){
            length++;
        }
    }		
}