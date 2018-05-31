const conquistador = {



  run(creep) {
    console.log("conquistador.carry.energy: " + creep.carry.energy);
    for (const name in Game.spawns) {
      const spawn = Game.spawns[name];
      const exits = Game.map.describeExits(spawn.room.name);
      if (!exits) {
        console.log(`Current room ${spawn.room.name} has no exits`);
        break;
      }

      console.log(`Current room ${spawn.room.name} has ${exits} exits`);

      for(const exit in exits){
        const nextRoomName = exits[exit];
        console.log(`Trying exit ${exit} to room ${nextRoomName}`);
        const pos = new RoomPosition(25, 25, nextRoomName);
        creep.moveTo(pos);
        return;
      }
    }
  }
};

module.exports = conquistador;
