var roleDefender = {

    /** @param {Creep} creep **/
    run: function(creep) {
        //console.log("running defender logic");
        var enemies= creep.room.find(FIND_HOSTILE_CREEPS);
        //console.log(JSON.stringify(enemies[0]));
        creep.moveTo(enemies[0]);
        creep.attack(enemies[0]);
    }
};

module.exports = roleDefender;
