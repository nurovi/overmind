const roleDefender = {
  /** @param {Creep} creep * */
  run(creep) {
    const enemies = creep.room.find(FIND_HOSTILE_CREEPS);
    creep.moveTo(enemies[0]);
    creep.attack(enemies[0]);
  }
};

module.exports = roleDefender;
