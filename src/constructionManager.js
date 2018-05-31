const constructionManager = {

  /** @param {Room} room * */
  run(room) {
    const controllerLevel = room.controller.level;
    const allowedConstructionSitesMaximum = 1;

    const myConstructionSites = room.find(FIND_MY_CONSTRUCTION_SITES);

    if (myConstructionSites.length >= allowedConstructionSitesMaximum) {
      // Already busy building something, wait until it's done to build something else
      return;
    }

    const myStructures = room.find(FIND_MY_STRUCTURES);
    const spawn = myStructures.filter(s => s.structureType === STRUCTURE_SPAWN)[0];

    // Prioritize building a container near the closest mining site
    if (controllerLevel > 0 && myStructures.filter(s => s.structureType === STRUCTURE_CONTAINER).length === 0) {
      // Find closest mining site
      const activeSources = room.find(FIND_SOURCES_ACTIVE);

      const closestSource = activeSources.sort((a, b) => {
        const distanceA = Math.sqrt(((spawn.pos.x - a.pos.x) ** 2) + ((spawn.pos.y - a.pos.y) ** 2));
        const distanceB = Math.sqrt(((spawn.pos.x - b.pos.x) ** 2) + ((spawn.pos.y - b.pos.y) ** 2));
        return distanceA - distanceB;
      })[0];

      // Now we have the closest active source, place the sctructure three steps towards the spawn from the source
      const path = room.findPath(closestSource.pos, spawn.pos);
      const structurePos = path[Math.min(path.length, 3)];

      // Place construction site and report errors
      room.createConstructionSite(structurePos.x, structurePos.y, STRUCTURE_CONTAINER);
      return;
    }

    // Next build extensions close to the spawn
    let possibleExtensions = controllerLevel < 2 ? 0 : 5;
    possibleExtensions = controllerLevel <= 2 ? controllerLevel : (controllerLevel - 2) * 10;
    const builtExtensions = myStructures.filter(s => s.structureType === STRUCTURE_EXTENSION).length;
    const availableExtensions = possibleExtensions - builtExtensions;
    if (availableExtensions > 0) {
      // We want to build extensions!
      // find the closest free space to the spawn using diagonal jumps of two
      const isFree = pos => Game.map.getTerrainAt(pos) !== 'wall' && room.lookAt(pos).filter(a => a.type !== LOOK_TERRAIN && a.type !== LOOK_CREEPS).length === 0;
      let firstFreePos;
      for (let i = 2; i < 50; i += 2) { // rooms ar all 50x50
        for (let j = 0; i < 4; j += 1) { // diagonals
          const xDir = j < 2 ? -1 : 1;
          const yDir = j % 2 === 0 ? -1 : 1;
          const x = spawn.pos.x + (xDir * i);
          const y = spawn.pos.y + (yDir * i);
          const pos = room.getPositionAt(x, y);
          if (isFree(pos)) {
            firstFreePos = pos;
            break;
          }
        }
      }

      if (firstFreePos) {
        room.createConstructionSite(firstFreePos, STRUCTURE_EXTENSION);
      }
    }
  }
};

module.exports = constructionManager;
