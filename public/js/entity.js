import { font, ents } from "/js/config.js";
import {
  entities,
  battleStarted,
  targettype,
  teamsettings,
} from "/js/entity.js";

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

canvas.oncontextmenu = function (e) {
  e.preventDefault();
};

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

function update() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

requestAnimationFrame(function draw() {
  if (
    canvas.width !== window.innerWidth ||
    canvas.height !== window.innerHeight
  ) {
    update();
  }
  ctx.fillStyle = "#E2E2E2";
  ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

  ctx.beginPath();
  ctx.moveTo(window.innerWidth / 2, 0);
  ctx.lineTo(window.innerWidth / 2, window.innerHeight);
  ctx.stroke();

  for (let count in entities) {
    ctx.fillStyle = entities[count].team ? "#FF0000" : "#00FF00";
    ctx.beginPath();
    ctx.arc(
      entities[count].x,
      entities[count].y,
      entities[count].size,
      0,
      Math.PI * 2,
      true
    );
    ctx.closePath();
    ctx.fill();
    switch (entities[count].type) {
      case "infect":
        ctx.fillStyle = "#134F13";
        ctx.fillRect(
          entities[count].x - entities[count].size / 2,
          entities[count].y - entities[count].size / 4,
          entities[count].size,
          entities[count].size / 2
        );
        break;
      case "healer":
        ctx.fillStyle = "#A50000";
        ctx.fillRect(
          entities[count].x - entities[count].size / 2,
          entities[count].y - entities[count].size / 4,
          entities[count].size,
          entities[count].size / 2
        );
        ctx.fillRect(
          entities[count].x - entities[count].size / 4,
          entities[count].y - entities[count].size / 2,
          entities[count].size / 2,
          entities[count].size
        );
        break;
      case "summoner":
        ctx.fillStyle = "#00EEEE";
        ctx.fillRect(
          entities[count].x - entities[count].size / 2,
          entities[count].y - entities[count].size / 4,
          entities[count].size,
          entities[count].size / 2
        );
        ctx.fillRect(
          entities[count].x - entities[count].size / 4,
          entities[count].y - entities[count].size / 2,
          entities[count].size / 2,
          entities[count].size
        );
        break;
    }
    ctx.fillStyle = "#000000";
    ctx.fillRect(
      entities[count].x - entities[count].size / 2,
      entities[count].y + entities[count].size + 5,
      entities[count].size,
      5
    );
    ctx.fillStyle = "#2AAA8A";
    ctx.fillRect(
      entities[count].x - entities[count].size / 2,
      entities[count].y + entities[count].size + 5,
      (entities[count].health / entities[count].maxhealth) *
        entities[count].size,
      5
    );
  }

  ctx.fillStyle = "#000000";
  ctx.font = `${font.size}px ${font.type}`;
  if (!battleStarted) {
    ctx.fillText(`Type: ${ents[targettype]}`, 0, font.size);
    ctx.fillText(
      `Team on left: ${!teamsettings[0] ? "green" : "red"}`,
      0,
      2.1 * font.size
    );
  }
  requestAnimationFrame(draw);
});
