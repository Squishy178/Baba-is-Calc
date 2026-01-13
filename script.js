const canvas = document.querySelector('canvas');
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

const TILESIZE = 24;
const levelw = 10;
const levelh = 10;

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
    "images/plus.png",
];

// state stuff
let turnInProgress = false;
const inputQueue = [];
const undoStack = [];

function saveState() {
    const state = objects.map(o => ({
        obj: o.getObject(),
        p: { x: o.p.x, y: o.p.y },
        facing: o.facing,
    }));
    return state;
}

function loadState(state) {
    state.forEach((s, i) => {
        const o = objects[i];
        o.changeObject(s.obj);
        o.p.x = s.p.x;
        o.p.y = s.p.y;
        o.vP.x = s.p.x;
        o.vP.y = s.p.y;
        o.facing = s.facing;
    });
}

function undo() {
    if (turnInProgress) return;
    if (undoStack.length === 0) return;
    const lastState = undoStack.pop();
    loadState(lastState);
}

function reset() {
    loadState(undoStack.shift());
    undoStack.length = 0;
    
    // Failed attempt at making a reset animation
    /*
    let timei = 0;
    let haveReset = false;
    const resetAnim = setInterval(() => {
        ctx.save();
        ctx

        if (timei < 7500) {
            
        }
        else if (timei > 7500) {


            haveReset = true;
            if (!haveReset) {
            }
        }

        timei++;
    }, 1000/FPS);

    setTimeout(() => clearInterval(resetAnim), 1500);
    */
}

const TURNTIME = 125;
let turnTimer = 0;
let lastTick = Date.now();

// Keys and all that garbage
const keys = {};
window.addEventListener('keydown', (e) => {
    const move = {
        ArrowUp: UP,
        KeyW: UP,
        ArrowDown: DOWN,
        KeyS: DOWN,
        ArrowLeft: LEFT,
        KeyA: LEFT,
        ArrowRight: RIGHT,
        KeyD: RIGHT,
        Space: null,
    }[e.code];

    if (e.code === 'KeyZ') undo();
    
    if (move === undefined) return;
    if (e.repeat) return;

    e.preventDefault();
    inputQueue.push(move);

    if (turnInProgress) return;
    startTick();

    keys[e.code] = true;
});
window.addEventListener('keyup', (e) => {
    if (keys[e.code]) {
        keys[e.code] = false;
    }
});


function startTick() {
    if (turnInProgress) return;
    if (inputQueue.length === 0) return;

    const move = inputQueue.shift();

    undoStack.push(saveState());

    turnInProgress = true;
    turnTimer = 0;

    if (move === null) {
        // wait
    }
    else {
        for (const o of objects.filter(o => o.isYou())) {
            
            o.moveBy(move);
            
        }
    }
    
    // Simulate the One Click. Stupid that it repeats, but works mostly
    Object.keys(keys).forEach(k => keys[k] = false);
}

function endTick() {
    for (const o of objects) {
        o.vP.x = o.p.x;
        o.vP.y = o.p.y;
    }

    

    checkEquations();

    turnInProgress = false;

    startTick();
}


function frame() {
    const start = Date.now();

    const delta = start - lastTick;
    lastTick = start;

    if (turnInProgress) {
        turnTimer += delta;
        const t = Math.min(turnTimer / TURNTIME, 1);
        
        for (const o of objects) {
            o.vP.x = lerp(o.vP.x, o.p.x, t);
            o.vP.y = lerp(o.vP.y, o.p.y, t);
        }

        if (t === 1) endTick();
    }
    for (const p of particles) {
        if (p.update(delta)){
            particles.splice(particles.indexOf(p),1)
        }
    }
    draw();

    const elapsed = Date.now() - start;
    if (elapsed < 1000/FPS) setTimeout(() => requestAnimationFrame(frame), 1000/FPS - elapsed);
    else requestAnimationFrame(frame);
}



const tintCanvas = document.createElement("canvas");
const tintCtx = tintCanvas.getContext("2d");
tintCanvas.width = TILESIZE;
tintCanvas.height = TILESIZE;

function applyTint(drawFunc, x, y, w, h, tint) {
    tintCtx.clearRect(0, 0, TILESIZE, TILESIZE);

    drawFunc(tintCtx);

    tintCtx.globalCompositeOperation = 'source-in';
    tintCtx.fillStyle = tint;
    tintCtx.fillRect(0, 0, w, h);
    tintCtx.globalCompositeOperation = 'source-over';

    ctx.drawImage(tintCanvas, x, y);
}

function shadeItUp(df, x, y, tint) {
    const dx = x * TILESIZE;
    const dy = y * TILESIZE;

    if (!tint) {
        ctx.translate(dx, dy);
        df(ctx);
        ctx.translate(-dx, -dy);
    }
    else applyTint(
        df,
        dx, dy,
        TILESIZE, TILESIZE,
        tint
    );
}

function drawImageAt(img, { x, y }, tint = undefined) {
    const df = (c) => c.drawImage(getImage(img), 0, 0, TILESIZE, TILESIZE);
    shadeItUp(df, x, y, tint);
}

function drawImageAtFrame(img, { x, y }, f, tint = undefined,size = TILESIZE) {
    const df = (c) => c.drawImage(getImage(img),
        f*24, 0,
        24, 24,
        0, 0,
        size, size
    );
    shadeItUp(df, x, y, tint);
}
function drawImageInSheet(img, { x, y }, s, f, tint = undefined) {
    const df = (c) => c.drawImage(getImage(img),
        f*24, s*24,
        24, 24,
        0, 0,
        TILESIZE, TILESIZE
    );
    shadeItUp(df, x, y, tint);
}

function draw() {
    ctx.fillStyle = "BLACK";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "WHITE";

    // Render Particles/Trail
    for (const p of particles) {
        let art = `images/${"goal"}.png`;//objectData[p.type].art
        let offset = 0.00375*(150-p.life);
        drawImageAtFrame(art,{x: p.p.x + offset, y: p.p.y+offset},0,false,TILESIZE / 150 * p.life);
    }

    // Render Objects
    for (const o of objects) {
        let oData = objectData[o.getObject()];
        let art = `images/${oData.art}.png`;

        // exception for unfinished art
        // Aight buh
        if (['baba', 'wall'].includes(o.getObject())) {
             
            drawImageAt(art, o.vP);
            continue;
        }
        const frame = Math.floor((Date.now()/200)%3);

        const numbermaybe = o.getObject().match(/(?<=number)\d+/g);
        if (numbermaybe) {
            drawImageInSheet(art, o.vP, numbermaybe[0], frame, 'gray');
            continue;
        }

        drawImageAtFrame(art, o.vP, frame);
    }
}



function init() {
    newObject(1, 1, "baba");
    addRule('baba', 'is', 'you');
    
    newObject(5, 5, "number1");

    newObject(3, 3, "wall");
    newObject(5, 3, "goal");
    addRule('goal', 'is', 'push');
    addRule('wall', 'is', 'stop');

    newObject(3, 5, 'add');
    addRule('add', 'is', 'push');

    newObject(1, 5, 'number1');
    addRule('number1', 'is', 'push');

    //newObject(3, 5, 'win');

    // Promise stuff for image loading BEFORE running the game.
    Promise.all(preloadImages.map(preloadImage))
    .then(() => requestAnimationFrame(frame));
}
init();