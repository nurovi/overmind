const conquistador = {
  run(creep) {
    if (!creep.memory.target) {
      // choose target
      for (const name in Game.spawns) {
        const spawn = Game.spawns[name];
        const exits = Game.map.describeExits(spawn.room.name);
        if (!exits) {
          break;
        }

        for (const exit in exits) {
          const nextRoomName = exits[exit];
          if (!(nextRoomName in creeps.memory.explored)) {
            creep.memory.target = nextRoomName;
            break;
          }
        }
      }
    }

    if (creep.memory.target && creep.room.name !== creep.memory.target) {
      // move to target
      const pos = new RoomPosition(25, 25, creep.memory.target);
      creep.moveTo(pos);
    } else if (creep.memory.target) {
      // find something to attack?
      if (creep.room.controller) {
        // attack controller
        if (creep.room.controller.owner && !creep.room.controller.my) {
          const err = creep.attackController(creep.room.controller);
          if (err !== OK) {
            creep.moveTo(creep.room.controller.pos);
          }
        } else if (!creep.room.controller.owner) {
          const err = creep.claimController(creep.room.controller);
          if (err !== OK) {
            creep.moveTo(creep.room.controller.pos);
          }
        } else {
          creep.memory.target = undefined;
        }
      } else {
        // pick another target
        creeps.memory.explored[creep.room.name] = true;
        const exits = Game.map.describeExits(creep.room.name);
        if (!exits) {
          return;
        }

        for (const exit in exits) {
          const nextRoomName = exits[exit];
          if (!(nextRoomName in creeps.memory.explored)) {
            creep.memory.target = nextRoomName;
            break;
          }
        }
      }
    }
  }
};

module.exports = conquistador;
