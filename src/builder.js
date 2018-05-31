const roleBuilder = {

  /** @param {Creep} creep * */
  run(creep) {
    if (creep.memory.building && creep.carry.energy === 0) {
      creep.memory.building = false;
      creep.say('🔄 harvest');
    }
    if (!creep.memory.building && creep.carry.energy >= creep.carryCapacity - 5) {
      creep.memory.building = true;
      creep.say('🚧 build');
    }

    if (creep.memory.building) {
      let target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
      if (target) {
        if (creep.build(target) === ERR_NOT_IN_RANGE) {
          creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });
        }
      } else {
        const targets = creep.room.find(FIND_STRUCTURES, {
          filter: structure => (structure.structureType === STRUCTURE_WALL && structure.hits < 100)
        });
        target = creep.pos.findClosestByRange(targets);
        if (creep.repair(target) === ERR_NOT_IN_RANGE) {
          creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });
        }
      }
    } else if (creep.withdraw(Game.spawns.Spawn1, RESOURCE_ENERGY, 5) === ERR_NOT_IN_RANGE) {
      creep.moveTo(Game.spawns.Spawn1, { visualizePathStyle: { stroke: '#ffaa00' } });
    }
  }
};

module.exports = roleBuilder;
