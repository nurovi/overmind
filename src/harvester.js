const roleHarvester = {

  /** @param {Creep} creep * */
  run(creep) {
    if (creep.carry.energy < creep.carryCapacity) {
      const source = creep.pos.findClosestByRange(FIND_SOURCES);
      if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
        creep.moveTo(source, { visualizePathStyle: { stroke: '#ffaa00' } });
      }
    } else {
      // pull this into a store energy method
      let targets = creep.room.find(FIND_STRUCTURES, {
        filter: structure => (structure.structureType === STRUCTURE_EXTENSION) && structure.energy < structure.energyCapacity
      });
      if (targets.length < 1) {
        targets = creep.room.find(FIND_STRUCTURES, {
          filter: structure => (structure.structureType === STRUCTURE_CONTAINER) && structure.store.energy < structure.storeCapacity
        });
      }
      if (targets.length < 1) {
        targets = creep.room.find(FIND_STRUCTURES, {
          filter: structure => (structure.structureType === STRUCTURE_SPAWN) && structure.energy < structure.energyCapacity
        });
      }

      if (targets.length > 0) {
        const target = creep.pos.findClosestByRange(targets);
        if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
          creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });
        }
      }
    }
  }
};

module.exports = roleHarvester;
