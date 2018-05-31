import roleHarvester from './harvester';
import roleUpgrader from './upgrader';
import roleBuilder from './builder';
import roleLogistics from './logistics';
import constructionManager from './constructionManager';

module.exports.loop = function () {

    // activate safe mode if available
    for(var element in Game.spawns){
        Game.spawns[element].room.controller.activateSafeMode();
    }

    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    for(var room_id in Game.rooms){
    	// Get creep type counts.
      const harvesters = _.filter(Game.creeps, (creep) => (creep.memory.role == 'harvester' && creep.memory.homeroom == room_id));
      const upgraders  = _.filter(Game.creeps, (creep) => (creep.memory.role == 'upgrader' && creep.memory.homeroom == room_id));
      const builders   = _.filter(Game.creeps, (creep) => (creep.memory.role == 'builder' && creep.memory.homeroom == room_id));
      const logistics  = _.filter(Game.creeps, (creep) => (creep.memory.role == 'logistics' && creep.memory.homeroom == room_id));
      const defenders  = _.filter(Game.creeps, (creep) => (creep.memory.role == 'defender' && creep.memory.homeroom == room_id));

      console.log(`h,u,b, l: ${harvesters.length},${upgraders.length},${builders.length},${logistics.length}`);

      if (harvesters.length < 3) {
        Game.spawns.Spawn1.createCreep([WORK, CARRY, MOVE], undefined, { role: 'harvester', homeroom: room_id });
      } else if (defenders.length < 2){
        Game.spawns.Spawn1.createCreep([MOVE, MOVE, ATTACK, TOUGH], undefined, { role: 'defender', homeroom: room_id  });
      } else if (upgraders.length < 3) {
        Game.spawns.Spawn1.createCreep([WORK, CARRY, MOVE], undefined, { role: 'upgrader', homeroom: room_id  });
      } else if (builders.length < 1) {
        Game.spawns.Spawn1.createCreep([WORK, CARRY, MOVE], undefined, { role: 'builder', homeroom: room_id  });
      } else if (logistics.length < 1) {
        Game.spawns.Spawn1.createCreep([WORK, CARRY, MOVE], undefined, { role: 'logistics', homeroom: room_id  });
      } else {
        // Decide what to construct in each room
        for (const name in Game.spawns) {
          const spawn = Game.spawns[name];
          constructionManager.run(spawn.room);
        }
      }
    }

  if (Game.spawns.Spawn1.spawning) {
    const spawningCreep = Game.creeps[Game.spawns.Spawn1.spawning.name];
    Game.spawns.Spawn1.room.visual.text(
      `🛠️${spawningCreep.memory.role}`,
      Game.spawns.Spawn1.pos.x + 1,
      Game.spawns.Spawn1.pos.y,
      { align: 'left', opacity: 0.8 }
    );
  }

  for (const name in Game.creeps) {
    const creep = Game.creeps[name];
    if (creep.memory.role === 'harvester') {
      roleHarvester.run(creep);
    } else if (creep.memory.role === 'upgrader') {
      roleUpgrader.run(creep);
    } else if (creep.memory.role === 'builder') {
      roleBuilder.run(creep);
    } else if (creep.memory.role === 'logistics') {
      roleLogistics.run(creep);
    } else if(creep.memory.role == 'defender') {
      roleDefender.run(creep);
    }
  }
};
