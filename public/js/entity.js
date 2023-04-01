import { healercircle, base, ents, summonerspawn, reloads, bulletLife, rangerdist } from "/js/config.js";

export let entities = [];
export let battleStarted = 0;
let id = 0;

function getEnts(target, teamType) {
  let targets = [];
  for (let coun in entities) {
    if (entities[coun].team == teamType && !entities[coun].type.startsWith('bullet') && entities[coun].id !== target.id) {
      let k = Math.hypot(
        entities[coun].x - target.x,
        entities[coun].y - target.y
      );
      targets.push([
        [entities[coun].x, entities[coun].y, entities[coun].size],
        k,
      ]);
    }
  }
  return targets;
};

function filter (targets) {
  let targ = Infinity;
  let choice;
  for (let c in targets) {
    if (targets[c][1] < targ) {
      targ = targets[c][1];
      choice = targets[c][0];
    }
  }
  return choice;
};

function slope (x, x1, y1) {
let differ = Math.atan2(y1 - x.y, x1 - x.x);
return [Math.cos(differ), Math.sin(differ)];
};

function checkEntsPos(x, y) {
  let results = [];
  for (let co in entities) {
    let checkX = 0;
    let checkY = 0;
    if (entities[co].x > x) {
      if (x > entities[co].x - entities[co].size) {
        checkX = 1;
      }
    } else {
      if (x < entities[co].x + entities[co].size) {
        checkX = 1;
      }
    }
    if (entities[co].y > y) {
      if (y > entities[co].y - entities[co].size) {
        checkY = 1;
      }
    } else {
      if (y < entities[co].y + entities[co].size) {
        checkY = 1;
      }
    }
    if (checkX && checkY) {
      results.push(co);
    }
  }
  return results;
};

function getMovementType(type, target) {
  switch (type) {
    case "norm":
      let targets;
      !target.type.startsWith('healer') ? targets = getEnts(target, !target.team) : targets = getEnts(target, target.team); 
      if (targets.length) {
        let choice = filter(targets);
        if (choice) {
          if (target.x > choice[0] + choice[2]) {
            target.x -= target.speed;
          }
          if (target.x < choice[0] - choice[2]) {
            target.x += target.speed;
          }
          if (target.y > choice[1] + choice[2]) {
            target.y -= target.speed;
          }
          if (target.y < choice[1] - choice[2]) {
            target.y += target.speed;
          }
        }
      }
      break;
      case "angle":
      target.x+=target.angle[0] * target.speed;
      target.y+=target.angle[1] * target.speed;
      break;
      case "ranger":
      let targeter = getEnts(target, !target.team);
      if (targeter.length) {
        let choice = filter(targeter);
        if (Math.hypot(target.x - choice[0], target.y - choice[1]) > rangerdist) {
          if (target.x > choice[0] + choice[2]) {
            target.x -= target.speed;
          }
          if (target.x < choice[0] - choice[2]) {
            target.x += target.speed;
          }
          if (target.y > choice[1] + choice[2]) {
            target.y -= target.speed;
          }
          if (target.y < choice[1] - choice[2]) {
            target.y += target.speed;
          }
        } else {
          if (target.x > choice[0] + choice[2]) {
            target.x += target.speed;
          }
          if (target.x < choice[0] - choice[2]) {
            target.x -= target.speed;
          }
          if (target.y > choice[1] + choice[2]) {
            target.y += target.speed;
          }
          if (target.y < choice[1] - choice[2]) {
            target.y -= target.speed;
          }
        }
      }
      break;
  }
}

function getDeathAction(type, address) {
  switch (type) {
    case "infect":
      if (!entities[address].type.startsWith('bullet')) {
      entities[address] = new ent(
        Number(!entities[address].team),
        "infect",
        entities[address].x,
        entities[address].y,
        entities[address].size,
        entities[address].maxhealth,
        entities[address].damage,
        entities[address].speed,
        entities[address].date
      );
      }
      break;
    default:
      entities.splice(address, 1);
  }
}

function getAbility(type, address) {
  switch (type) {
    case "heal":
      for (let u in entities) {
        if (
          Math.hypot(
            entities[address].x - entities[u].x,
            entities[address].y - entities[u].y
          ) < healercircle.radius &&
          entities[u].health < entities[u].maxhealth &&
          entities[address].team === entities[u].team
        ) {
          entities[u].health += healercircle.hp;
        }
      }
      break;
    case "summon":
      let h = base.base;
      if (Date.now() - entities[address].date > summonerspawn * 1000 && getEnts(entities[address], !entities[address].team).length) {
        pushEnt(
          entities[address].team,
          "base",
          entities[address].x + 0.1,
          entities[address].y + 0.1,
          h.size,
          h.health,
          h.damage,
          h.speed
        );
        entities[address].date = Date.now();
      }
      break;
      case "shoot":
      let o = base.bullet;
      if (Date.now() - entities[address].date > reloads.ranger * 1000 && getEnts(entities[address], !entities[address].team).length) {
        pushEnt(
          entities[address].team,
          "bullet",
          entities[address].x + 0.1,
          entities[address].y + 0.1,
          o.size,
          o.health,
          o.damage,
          o.speed
        );
        let targets = getEnts(entities[entities.length - 1], !entities[entities.length - 1].team);
        let choice = filter(targets);
        entities[entities.length - 1].angle = slope(entities[entities.length - 1], choice[0], choice[1]);
        entities[address].date = Date.now();
      }
      break;
      case "timedLife":
        if (Date.now() - entities[address].date > bulletLife * 1000) {entities.splice(address, 1)}; 
        break;
  }
}

class ent {
  constructor(team, type, x, y, size, health, damage, speed) {
    this.team = team;
    this.type = type;
    this.x = x;
    this.y = y;
    this.size = size;
    this.health = health;
    this.damage = damage;
    this.speed = speed;
    this.maxhealth = health;
    this.date = Date.now();
    this.id = id;
  }
}

function pushEnt(team, type, x, y, size, health, damage, speed) {
  entities.push(new ent(team, type, x, y, size, health, damage, speed));
  id++;
}

function collision(x1, x2, y1, y2, r1, r2) {
  let collisionn = "none";
  if (Math.hypot(x1 - x2, y1 - y2) < r1 + r2) {
    collisionn = "true";
  }
  return collisionn;
}

requestAnimationFrame(function physics() {
  if (battleStarted) {
    for (let count in entities) {
      if (entities[count].x - entities[count].size < 0) {
        entities[count].x += Math.abs(entities[count].x);
      }
      if (entities[count].x + entities[count].size > window.innerWidth) {
        entities[count].x -= Math.abs(entities[count].x - window.innerWidth);
      }
      if (entities[count].y + entities[count].size > window.innerHeight) {
        entities[count].y -= Math.abs(entities[count].y - window.innerHeight);
      }
      if (entities[count].y - entities[count].size < 0) {
        entities[count].y += Math.abs(entities[count].y);
      }
      for (let coun in entities) {
        if (
          count !== coun &&
          collision(
            entities[count].x,
            entities[coun].x,
            entities[count].y,
            entities[coun].y,
            entities[count].size,
            entities[coun].size
          ) !== "none"
        ) {
          if (!entities[count].type.startsWith('bullet') && !entities[coun].type.startsWith('bullet') || entities[count].team !== entities[coun].team) {
            let angle = Math.abs(
              Math.atan2(
                entities[count].y - entities[coun].y,
                entities[count].x - entities[coun].x
              )
            );
          if (entities[count].x < entities[coun].x) {
            entities[count].x -= Math.cos(angle) * entities[count].speed;
            entities[coun].x += Math.cos(angle) * entities[coun].speed;
          } else {
            entities[count].x += Math.cos(angle) * entities[count].speed;
            entities[coun].x -= Math.cos(angle) * entities[coun].speed;
          }
          if (entities[count].y < entities[coun].y) {
            entities[count].y -= Math.sin(angle) * entities[count].speed;
            entities[coun].y += Math.sin(angle) * entities[coun].speed;
          } else {
            entities[count].y += Math.sin(angle) * entities[count].speed;
            entities[coun].y -= Math.sin(angle) * entities[coun].speed;
          }
          if (entities[count].team !== entities[coun].team) {
            entities[count].health -= entities[coun].damage;
            entities[coun].health -= entities[count].damage;
            entities[count].lastHit = entities[coun].type;
            entities[coun].lastHit = entities[count].type;
          }
        }
        }
      }
      if (entities[count].health <= 0) {
        getDeathAction(entities[count].lastHit, count);
      }
      if (entities[count]) {
        switch (entities[count].type) {
          case "healer":
            getMovementType("norm", entities[count]);
            getAbility("heal", count);
            break;
          default:
            getMovementType("norm", entities[count]);
            break;
          case "summoner":
            getMovementType("norm", entities[count]);
            getAbility("summon", count);
            break;
          case "ranger":
              getMovementType("ranger", entities[count]);
              getAbility("shoot", count);
              break;
          case "bullet":
              getMovementType("angle", entities[count]);
              getAbility("timedLife", count);
        }
      }
    }
  }
  requestAnimationFrame(physics);
});

export let targettype = 0;
export let teamsettings = [0, 1];

document.addEventListener("keydown", function (event) {
  switch (event.code) {
    case "Enter":
      battleStarted = !battleStarted;
      break;
    case "ArrowUp":
      targettype++;
      if (!(targettype % ents.length)) {
        targettype = 0;
      }
      break;
    case "ArrowDown":
      targettype--;
      if (targettype < 0) {
        targettype = ents.length - 1;
      }
      break;
    case "KeyP":
      [teamsettings[0], teamsettings[1]] = [teamsettings[1], teamsettings[0]];
      break;
  }
});

document.addEventListener("mousedown", function (event) {
  let h = base[`${ents[targettype]}`];
  if (!battleStarted) {
    switch (event.which) {
      case 1:
        pushEnt(
          event.pageX > window.innerWidth / 2
            ? teamsettings[1]
            : teamsettings[0],
          ents[targettype],
          event.pageX,
          event.pageY,
          h.size,
          h.health,
          h.damage,
          h.speed
        );
        break;
      case 3:
        let k = checkEntsPos(event.pageX, event.pageY);
        for (let count in k) {
          entities.splice(k[count], 1);
        }
    }
  }
});

