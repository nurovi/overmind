const roleLogistics = {

  /** @param {Creep} creep * */
  run(creep) {
    if (creep.carry.energy < creep.carryCapacity) {
      let sources = creep.room.find(FIND_STRUCTURES, {
        filter: structure => (structure.structureType === STRUCTURE_CONTAINER && structure.energy > 0)
      });
      if (sources.length < 1) {
        sources = creep.room.find(FIND_STRUCTURES, {
          filter: structure => (structure.structureType === STRUCTURE_EXTENSION && structure.energy > 0)
        });
      }
      const source = creep.pos.findClosestByRange(sources);
      if (creep.withdraw(source, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        creep.moveTo(source, { visualizePathStyle: { stroke: '#ffffff' } });
      }
    } else if (creep.transfer(Game.spawns.Spawn1, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
      creep.moveTo(Game.spawns.Spawn1, { visualizePathStyle: { stroke: '#ffffff' } });
    }
  }
};

module.exports = roleLogistics;
