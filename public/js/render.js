import {
    font,
    ents
} from "/js/config.js";
import {
    entities,
    battleStarted,
    targettype,
    teamsettings,
    entCount
} from "/js/entity.js";

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

canvas.oncontextmenu = function(e) {
    e.preventDefault();
};

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

function update() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function arcer (fill, k) {
    ctx.fillStyle = fill;
    ctx.beginPath();
    ctx.arc(
        k.x,
        k.y,
        k.size / 1.25,
        0,
        Math.PI * 2,
        true
    );
    ctx.closePath();
    ctx.fill();
};

function cross (fill, k) {
    ctx.fillStyle = fill;
    ctx.fillRect(
        k.x - k.size / 2,
        k.y - k.size / 4,
        k.size,
        k.size / 2
    );
    ctx.fillRect(
        k.x - k.size / 4,
        k.y - k.size / 2,
        k.size / 2,
        k.size
    );
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
                cross("#134F13", entities[count]);
                break;
            case "healer":
                cross("#A50000", entities[count]);
                break;
            case "summoner":
                cross("#00EEEE", entities[count]);
                break;
            case "ranger":
                arcer("#4b5320", entities[count]);
                break;
                case "commando":
                arcer("#FFFFFF", entities[count]);
                break;
        }
        if (entities[count].health / entities[count].maxhealth < 1) {
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
        ctx.fillText(
            `Green : Red ents: ${entCount[0]} : ${entCount[1]}`,
            0,
            3.1 * font.size
        );
    }
    requestAnimationFrame(draw);
});
