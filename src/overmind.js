import roleHarvester from './harvester';
import roleUpgrader from './upgrader';
import roleBuilder from './builder';
import roleLogistics from './logistics';
import roleDefender from './defender';
import constructionManager from './constructionManager';
import roleConquistador from './conquistador';

module.exports.loop = () => {
  const roomSpawns = {};
  // activate safe mode if available
  for (const element in Game.spawns) {
    Game.spawns[element].room.controller.activateSafeMode();
    roomSpawns[Game.spawns[element].room.name] = element;
  }

  for (const name in Memory.creeps) {
    if (!Game.creeps[name]) {
      delete Memory.creeps[name];
    }
  }

  for (const roomId in Game.rooms) {
    const room = Game.rooms[roomId];
    const sources = room.find(FIND_SOURCES_ACTIVE);

    // Get creep type counts.
    const harvesters = _.filter(Game.creeps, creep => creep.memory.role === 'harvester' && creep.memory.homeroom === roomId);
    const upgraders = _.filter(Game.creeps, creep => creep.memory.role === 'upgrader' && creep.memory.homeroom === roomId);
    const builders = _.filter(Game.creeps, creep => creep.memory.role === 'builder' && creep.memory.homeroom === roomId);
    const logistics = _.filter(Game.creeps, creep => creep.memory.role === 'logistics' && creep.memory.homeroom === roomId);
    const defenders = _.filter(Game.creeps, creep => creep.memory.role === 'defender' && creep.memory.homeroom === roomId);
    const conquistadores = _.filter(Game.creeps, creep => creep.memory.role === 'conquistador' && creep.memory.homeroom === roomId);

    if (Game.spawns[roomSpawns[roomId]]) {
      if (harvesters.length < 3 * sources.length) {
        const source = sources[harvesters.length % sources.length];
        Game.spawns[roomSpawns[roomId]].createCreep([WORK, CARRY, MOVE], undefined, { role: 'harvester', homeroom: roomId, source });
      } else if (defenders.length < 2) {
        Game.spawns[roomSpawns[roomId]].createCreep([MOVE, MOVE, ATTACK, TOUGH], undefined, { role: 'defender', homeroom: roomId });
      } else if (upgraders.length < 3) {
        Game.spawns[roomSpawns[roomId]].createCreep([WORK, CARRY, MOVE], undefined, { role: 'upgrader', homeroom: roomId });
      } else if (builders.length < 1) {
        Game.spawns[roomSpawns[roomId]].createCreep([WORK, CARRY, MOVE], undefined, { role: 'builder', homeroom: roomId });
      } else if (logistics.length < 1) {
        Game.spawns[roomSpawns[roomId]].createCreep([WORK, CARRY, MOVE], undefined, { role: 'logistics', homeroom: roomId });
      } else if (conquistadores.length < 1) {
        Game.spawns[roomSpawns[roomId]].createCreep([CLAIM, CARRY, MOVE], undefined, { role: 'conquistador', homeroom: roomId, explored: { roomId: true } });
      }

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
      } else if (creep.memory.role === 'conquistador') {
        roleConquistador.run(creep, Game);
      }
    }
  }
};
