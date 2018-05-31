const roleUpgrader = {

  /** @param {Creep} creep * */
  run(creep) {
    if (creep.memory.upgrading && creep.carry.energy === 0) {
      creep.memory.upgrading = false;
      creep.say('🔄 harvest');
    }
    if (!creep.memory.upgrading && creep.carry.energy === creep.carryCapacity) {
      creep.memory.upgrading = true;
      creep.say('⚡ upgrade');
    }

    if (creep.memory.upgrading) {
      if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller, { visualizePathStyle: { stroke: '#ffffff' } });
      }
    } else if (creep.withdraw(Game.spawns.Spawn1, RESOURCE_ENERGY, 5) === ERR_NOT_IN_RANGE) {
      creep.moveTo(Game.spawns.Spawn1, { visualizePathStyle: { stroke: '#ffaa00' } });
    }
  }
};

module.exports = roleUpgrader;
