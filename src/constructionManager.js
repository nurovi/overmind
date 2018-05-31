const constructionManager = {

  /** @param {Room} room * */
  run(room) {
    const controllerLevel = room.controller.level;
    const allowedConstructionSitesMaximum = 1;

    const myConstructionSites = room.find(FIND_MY_CONSTRUCTION_SITES);

    if (myConstructionSites.length >= allowedConstructionSitesMaximum) {
      // Already busy building something, wait until it's done to build something else
      console.log(`We are currently building ${myConstructionSites.length} structures in room ${room.name}: [${myConstructionSites.map(s => s.structureType).join(', ')}]`);
      return;
    }

    const myStructures = room.find(FIND_MY_STRUCTURES);
    console.log(`Looking to build new structure(s). We currently have ${myStructures.length} structures in room ${room.name}: [${myStructures.map(s => s.structureType).join(', ')}]`);

    // Prioritize building a container near the closest mining site
    if (controllerLevel > 0 && myStructures.filter(s => s.structureType === STRUCTURE_CONTAINER).length === 0) {
      // Find closest mining site
      const spawn = myStructures.filter(s => s.structureType === STRUCTURE_SPAWN)[0];
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
      const err = room.createConstructionSite(structurePos.x, structurePos.y, STRUCTURE_CONTAINER);
      if (err === 0) {
        console.log(`Success placing ${STRUCTURE_CONTAINER} in room ${room.name} at pos (${structurePos.x}, ${structurePos.y})`);
      } else {
        console.log(`Error (${err}) placing ${STRUCTURE_CONTAINER} in room ${room.name} at pos (${structurePos.x}, ${structurePos.y})`);
      }
    }
  }
};

module.exports = constructionManager;
