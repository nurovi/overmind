const conquistador = {
  run(creep) {
    console.log(`${creep.name} is in ${creep.room.name} at (${creep.pos.x},${creep.pos.y}) and has target ${creep.memory.target} and home ${creep.memory.homeroom}`);

    if (!creep.memory.target) {
      // choose target
      for (const name in Game.spawns) {
        const spawn = Game.spawns[name];
        const exits = Game.map.describeExits(spawn.room.name);
        if (!exits) {
          console.log(`Current room ${spawn.room.name} has no exits`);
          break;
        }

        console.log(`Current room ${spawn.room.name} has ${Object.keys(exits).length} exits`);

        for (const exit in exits) {
          const nextRoomName = exits[exit];
          if (!(nextRoomName in creeps.memory.explored)) {
            console.log(`Trying exit ${exit} to room ${nextRoomName}`);
            creep.memory.target = nextRoomName;
            break;
          }
        }
      }
    }

    if (creep.memory.target && creep.room.name !== creep.memory.target) {
      // move to target
      console.log('Charging at target!');
      const pos = new RoomPosition(25, 25, creep.memory.target);
      creep.moveTo(pos);
    } else if (creep.memory.target) {
      // find something to attack?
      if (creep.room.controller) {
        // attack controller
        const err = creep.claimController(creep.room.controller);
        if (err !== OK) {
          creep.moveTo(creep.room.controller.pos);
        }
        console.log(`Attacking ${creep.room.controller} with result ${err}`);
      } else {
        // pick another target
        creeps.memory.explored[creep.room.name] = true;
        const exits = Game.map.describeExits(creep.room.name);
        if (!exits) {
          console.log(`Current target room ${creep.room.name} has no exits`);
          return;
        }

        console.log(`Current target room ${creep.room.name} has ${Object.keys(exits).length} exits`);

        for (const exit in exits) {
          const nextRoomName = exits[exit];
          if (!(nextRoomName in creeps.memory.explored)) {
            console.log(`Choosing new target! ${exit} to room ${nextRoomName}`);
            creep.memory.target = nextRoomName;
            break;
          }
        }
      }
    }
  }
};

module.exports = conquistador;
