import { healercircle, base, ents, reloads, bulletLife, rangerdist, bulletptrs, abilitytimers, rolldist } from "/js/config.js";

export let entities = [];
export let battleStarted = 0;
let id = 0;

function getEnts(target, teamType, wantBullets) {
    let targets = [];
    for (let coun in entities) {
        if (entities[coun].team == teamType && entities[coun].id !== target.id) {
            if (wantBullets || !entities[coun].type.startsWith('bullet')) {
            let k = Math.hypot(
                entities[coun].x - target.x,
                entities[coun].y - target.y
            );
            targets.push([
                entities[coun],
                k,
            ]);
        }
        }
    }
    return targets;
};

function filter(targets) {
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

function slope(x, x1, y1) {
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
            let targets = getEnts(target, !target.team, 0);
            if (targets.length) {
                let choice = filter(targets);
                if (choice) {
                    if (target.x > choice.x + choice.size) {
                        target.x -= target.speed;
                    }
                    if (target.x < choice.x - choice.size) {
                        target.x += target.speed;
                    }
                    if (target.y > choice.y + choice.size) {
                        target.y -= target.speed;
                    }
                    if (target.y < choice.y - choice.size) {
                        target.y += target.speed;
                    }
                }
            }
            break;
        case "angle":
            target.x += target.angle[0] * target.speed;
            target.y += target.angle[1] * target.speed;
            break;
        case "ranger":
            let targeter = getEnts(target, !target.team, 0);
            if (targeter.length) {
                let choice = filter(targeter);
                if (Math.hypot(target.x - choice.x, target.y - choice.y) > rangerdist) {
                    if (target.x > choice.x + choice.size) {
                        target.x -= target.speed;
                    }
                    if (target.x < choice.x - choice.size) {
                        target.x += target.speed;
                    }
                    if (target.y > choice.y + choice.size) {
                        target.y -= target.speed;
                    }
                    if (target.y < choice.y - choice.size) {
                        target.y += target.speed;
                    }
                } else {
                    if (target.x > choice.x + choice.size) {
                        target.x += target.speed;
                    }
                    if (target.x < choice.x - choice.size) {
                        target.x -= target.speed;
                    }
                    if (target.y > choice.y + choice.size) {
                        target.y += target.speed;
                    }
                    if (target.y < choice.y - choice.size) {
                        target.y -= target.speed;
                    }
                }
            }
            break;
            case "medic":
               let targe = getEnts(target, target.team, 0);
               let targ = Infinity;
               let choice;
                for (let c in targe) {
                    if (targe[c][1] < targ && targe[c][0].health / targe[c][0].maxhealth < healercircle.rushto) {
                    targ = targe[c][1];
                    choice = targe[c];
                }
            }
            if (choice) {
                if (Math.hypot(target.x - choice[0].x, target.y - choice[0].y) > healercircle.radius) {
                if (target.x > choice[0].x + choice[0].size) {
                    target.x -= target.speed;
                }
                if (target.x < choice[0].x - choice[0].size) {
                    target.x += target.speed;
                }
                if (target.y > choice[0].y + choice[0].size) {
                    target.y -= target.speed;
                }
                if (target.y < choice[0].y - choice[0].size) {
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
            if (!(entities[address].tick % reloads[entities[address].type])) {
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
            }
            break;
        case "shoot":
            let o = base.bullet;
            if (!(entities[address].tick % reloads[entities[address].type])) {
                pushEnt(
                    entities[address].team,
                    bulletptrs[entities[address].type],
                    entities[address].x + 0.1,
                    entities[address].y + 0.1,
                    o.size,
                    o.health,
                    o.damage,
                    o.speed
                );
                let targets = getEnts(entities[entities.length - 1], !entities[entities.length - 1].team, 0);
                let choice = filter(targets);
                if (choice) {
                entities[entities.length - 1].angle = slope(entities[entities.length - 1], choice.x, choice.y);
                } else {
                entities.splice(entities.length - 1, 1);
                }
            }
            break;
        case "timedLife":
            if (entities[address].tick > bulletLife) {
                entities.splice(address, 1)
            };
            break;
        case "roll":
            if (!(entities[address].tick % abilitytimers[entities[address].type])) {
                let targets = getEnts(entities[entities.length - 1], !entities[entities.length - 1].team, 1);
                let choice = filter(targets);
                if (choice) {
                if (choice.x < entities[address].x) {
                   entities[address].x-=rolldist;
                }
                if (choice.x > entities[address].x) {
                    entities[address].x+=rolldist;
                }
                if (choice.y < entities[address].y) {
                    entities[address].y-=rolldist;
                }
                if (choice.y > entities[address].y) {
                    entities[address].y+=rolldist;
                }
                }
            }
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
        this.id = id;
        this.tick = 0;
    }
}

function pushEnt(team, type, x, y, size, health, damage, speed) {
    entities.push(new ent(team, type, x, y, size, health, damage, speed));
    id++;
}

function collision(x1, x2, y1, y2, r1, r2) {
    if (Math.hypot(x1 - x2, y1 - y2) < r1 + r2) {
        return true;
    }
    return false;
}

export let entCount = [0, 0];

requestAnimationFrame(function physics() {
    entCount = [0, 0];
    for (let count in entities) {
        entities[count].team ? entCount[1]++ : entCount[0]++;
        }
    if (battleStarted) {
        for (let count in entities) {
            entities[count].tick++;
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
                    )
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
            if (!entities[count].type.startsWith('bullet')) {
                switch (entities[count].type) {
                    case "healer":
                        getMovementType("medic", entities[count]);
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
                    case "commando":
                        getMovementType("norm", entities[count]);
                        getAbility("shoot", count); 
                        getAbility("roll", count);
                        break;
            }
        } else {
            getMovementType("angle", entities[count]);
            getAbility("timedLife", count);
        }
            if (entities[count].health <= 0) {
                getDeathAction(entities[count].lastHit, count);
            }
        }
    }
    requestAnimationFrame(physics);
});

export let targettype = 0;
export let teamsettings = [0, 1];

document.addEventListener("keydown", function(event) {
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

document.addEventListener("mousedown", function(event) {
    let h = base[`${ents[targettype]}`];
    if (!battleStarted) {
        switch (event.which) {
            case 1:
                pushEnt(
                    event.pageX > window.innerWidth / 2 ?
                    teamsettings[1] :
                    teamsettings[0],
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
