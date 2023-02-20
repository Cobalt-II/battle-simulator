import { healercircle, base, ents, summonerspawn } from "/js/config.js";

export let entities = [];
export let battleStarted = 0;
let id = 0;

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
}

function checkIfEntDead(id) {
  for (let count in entities) {
    if (entities[count].id === id) {
      return false;
    }
  }
  return true;
}

function checkIfTeamDead(team) {
  for (let count in entities) {
    if (entities[count].team === team) {
      return false;
    }
  }
  return true;
}

function getMovementType(type, target) {
  switch (type) {
    case "norm":
      let targets = [];
      for (let coun in entities) {
        if (entities[coun].team !== target.team) {
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
      if (targets.length) {
        let targ = Infinity;
        let choice = 0;
        for (let c in targets) {
          if (targets[c][1] < targ) {
            targ = targets[c][1];
            choice = targets[c][0];
          }
        }
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
  }
}

function getDeathAction(type, address) {
  switch (type) {
    case "infect":
      entities[address] = new ent(
        Number(!entities[address].team),
        "infect",
        entities[address].x,
        entities[address].y,
        entities[address].size,
        entities[address].maxhealth,
        entities[address].damage,
        entities[address].speed,
        entities[address].id
      );
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
      let o = entities[address].id;
      let j = entities[address].team;
      let k = setInterval(() => {
        if (battleStarted) {
          let num;
          let num2;
          if (!checkIfEntDead(o)) {
            if (!checkIfTeamDead(Number(!j))) {
              if (Math.random() < 0.5) {
                num = -0.1;
              } else {
                num = 0.1;
              }
              if (Math.random() < 0.5) {
                num2 = -0.1;
              } else {
                num2 = 0.1;
              }
              pushEnt(
                entities[address].team,
                "base",
                entities[address].x + num,
                entities[address].y + num2,
                h.size,
                h.health,
                h.damage,
                h.speed
              );
            }
          } else {
            clearInterval(k);
          }
        }
      }, summonerspawn * 1000);
      break;
  }
}

class ent {
  constructor(team, type, x, y, size, health, damage, speed, id) {
    this.team = team;
    this.type = type;
    this.x = x;
    this.y = y;
    this.size = size;
    this.health = health;
    this.damage = damage;
    this.speed = speed;
    this.maxhealth = health;
    this.id = id;
  }
}

function pushEnt(team, type, x, y, size, health, damage, speed) {
  entities.push(new ent(team, type, x, y, size, health, damage, speed, id));
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
            if (!entities[count].initiate) {
              getAbility("summon", count);
              entities[count].initiate = 1;
            }
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
