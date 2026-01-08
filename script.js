const canvas = document.querySelector('canvas');
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

const TILESIZE = 24;
const levelw = 8;
const levelh = 8;

canvas.width = levelw * TILESIZE;
canvas.height = levelh * TILESIZE;

const UP = { x: 0, y: -1 };
const DOWN = { x: 0, y: 1 };
const LEFT = { x: -1, y: 0 };
const RIGHT = { x: 1, y: 0 };
const DIRECTIONS = [UP, DOWN, LEFT, RIGHT];

const FPS = 60;
function lerp(start, end, t) {
    return start + (end - start) * t;
};

// Images. Javascript seems to hate them but whatever
var loadedImages = {};
let imgLoadedCount = 0;
function preloadImage(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            resolve(img);
        };
        img.onerror = reject;
        img.src = url;
        loadedImages[url] = img;
    });
}

function getImage(url) {
    return loadedImages[url];
}

const preloadImages = [
    "images/babababa.png",
    "images/goal.png",
    "images/wall.png",
    "images/numbers.png",
];


// Keys and all that garbage
const keys = {};
window.addEventListener('keydown', (e) => {
    keys[e.code] = true;
});
window.addEventListener('keyup', (e) => {
    keys[e.code] = false;
});


function tick() {
    const moveI = [
        ['ArrowUp', 'KeyW'],
        ['ArrowDown', 'KeyS'],
        ['ArrowLeft', 'KeyA'],
        ['ArrowRight', 'KeyD']
    ].findIndex(a => a.some(k => keys[k]));
    const move = [UP, DOWN, LEFT, RIGHT].at(moveI);

    if (moveI !== -1) {
        for (const o of objects.filter(o => o.isYou())) {
            o.moveBy(move);
        }
    }
    /*
    for (const o of objects) {
        let oData = objectData[o.type];
        if (collide(player.x,player.y,o.x,o.y)) {
            if (oData.pushable) {
                o.x += player.x-Math.round(player.vX);
                o.y += player.y-Math.round(player.vY);
                let o2 = getObjectAt(o.x,o.y);
                if (o2){
                
                    if (collide(o2.x,o2.y,o.x,o.y) && o != o2){
                        player.x = Math.round(player.vX);
                        player.vX = Math.round(player.vX);
                        player.y = Math.round(player.vY);
                        player.vY = Math.round(player.vY);

                        o.x = Math.round(o.vX);
                        o.vX = Math.round(o.vX);
                        o.y = Math.round(o.vY);
                        o.vY = Math.round(o.vY);
                    }
                } 
            }else{
                player.x = Math.round(player.vX);
                player.vX = Math.round(player.vX);
                player.y = Math.round(player.vY);
                player.vY = Math.round(player.vY);
            }
            
        }
    }
    */
    
    // Simulate the One Click. Stupid that it repeats, but works mostly
    Object.values(keys).forEach((v, i) => keys[Object.keys(keys)[i]] = false);
}

let lastTick = Date.now();
function frame() {
    const start = Date.now();

    if (Date.now() - lastTick > 1000/(FPS/2)) {
        tick();
        lastTick = Date.now();
    }

    //checkEquations();

    for (const o of objects) {
        o.vP.x = lerp(o.vP.x, o.p.x, 0.4);
        o.vP.y = lerp(o.vP.y, o.p.y, 0.4);
        if (Math.abs(o.vP.x - o.p.x) < 0.05) o.vP.x = o.p.x;
        if (Math.abs(o.vP.y - o.p.y) < 0.05) o.vP.y = o.p.y;
    }

    draw();

    const elapsed = Date.now() - start;
    if (elapsed < 1000/FPS) setTimeout(() => requestAnimationFrame(frame), 1000/FPS - elapsed);
    else requestAnimationFrame(frame);
}

function drawImageAt(img, { x, y }) {
    ctx.drawImage(getImage(img), x * TILESIZE, y * TILESIZE, TILESIZE, TILESIZE);
}
function drawImageAtFrame(img, { x, y }, f) {
    ctx.drawImage(getImage(img),
        f*24, 0,
        24, 24,
        x*TILESIZE, y*TILESIZE,
        TILESIZE, TILESIZE
    );
}
function drawImageInSheet(img, { x, y }, s, f) {
    ctx.drawImage(getImage(img),
        f*24, s*24,
        24, 24,
        x*TILESIZE, y*TILESIZE,
        TILESIZE, TILESIZE
    );
}

function draw() {
    ctx.fillStyle = "BLACK";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "WHITE";

    for (const o of objects) {
        let oData = objectData[o.getObject()];
        let art = `images/${oData.art}.png`;

        // exception for unfinished art
        if (['baba', 'wall'].includes(o.getObject())) {
            
            drawImageAt(art, o.vP);
            continue;
        }
        const frame = Math.floor((Date.now()/200)%3);

        const numbermaybe = o.getObject().match(/(?<=number)\d+/g);
        if (numbermaybe) {
            drawImageInSheet(art, o.vP, numbermaybe[0], frame);
            continue;
        }

        drawImageAtFrame(art, o.vP, frame);
    }
}



function init() {
    newObject(1, 1, "baba");
    addRule('baba', 'you');
    
    newObject(5, 5, "number1");

    newObject(3, 3, "wall");
    newObject(5, 3, "goal");
    addRule('goal', 'push');
    addRule('wall', 'stop');

    //newObject(3, 5, 'win');

    // Promise stuff for image loading BEFORE running the game.
    Promise.all(preloadImages.map(preloadImage))
    .then(() => requestAnimationFrame(frame));
}
init();