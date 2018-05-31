import roleHarvester from './harvester';
import roleUpgrader from './upgrader';
import roleBuilder from './builder';
import roleLogistics from './logistics';
import constructionManager from './constructionManager';

module.exports.loop = () => {
  // activate safe mode if available
  for (const element in Game.spawns) {
    Game.spawns[element].room.controller.activateSafeMode();
  }

  for (const name in Memory.creeps) {
    if (!Game.creeps[name]) {
      delete Memory.creeps[name];
      console.log('Clearing non-existing creep memory:', name);
    }
  }

  // Get creep type counts.
  const harvesters = _.filter(Game.creeps, creep => creep.memory.role === 'harvester');
  const upgraders = _.filter(Game.creeps, creep => creep.memory.role === 'upgrader');
  const builders = _.filter(Game.creeps, creep => creep.memory.role === 'builder');
  const logistics = _.filter(Game.creeps, creep => creep.memory.role === 'logistics');
  const defenders = _.filter(Game.creeps, creep => creep.memory.role === 'defender');

  console.log(`h,u,b, l: ${harvesters.length},${upgraders.length},${builders.length},${logistics.length}`);

  if (harvesters.length < 3) {
    Game.spawns.Spawn1.createCreep([WORK, CARRY, MOVE], undefined, { role: 'harvester' });
  } else if (defenders.length < 2) {
    Game.spawns.Spawn1.createCreep([MOVE, MOVE, ATTACK, TOUGH], undefined, { role: 'defender' });
  } else if (upgraders.length < 3) {
    Game.spawns.Spawn1.createCreep([WORK, CARRY, MOVE], undefined, { role: 'upgrader' });
  } else if (builders.length < 1) {
    Game.spawns.Spawn1.createCreep([WORK, CARRY, MOVE], undefined, { role: 'builder' });
  } else if (logistics.length < 1) {
    Game.spawns.Spawn1.createCreep([WORK, CARRY, MOVE], undefined, { role: 'logistics' });
  } else {
    // Decide what to construct in each room
    for (const name in Game.spawns) {
      const spawn = Game.spawns[name];
      constructionManager.run(spawn.room);
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
    } else if (creep.memory.role === 'defender') {
      roleDefender.run(creep);
    }
  }
};
