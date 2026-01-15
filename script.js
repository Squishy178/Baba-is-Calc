const canvas = document.querySelector('canvas');
const ctx = canvas.getContext("2d");

const TILESIZE = 24;
const levelw = 10;
const levelh = 10;
const SCALINGFACTOR = 2;

canvas.width = levelw * TILESIZE * SCALINGFACTOR;
canvas.height = levelh * TILESIZE * SCALINGFACTOR;
ctx.imageSmoothingEnabled = false;
ctx.scale(SCALINGFACTOR, SCALINGFACTOR);

const UP = { x: 0, y: -1 };
const DOWN = { x: 0, y: 1 };
const LEFT = { x: -1, y: 0 };
const RIGHT = { x: 1, y: 0 };
const DIRECTIONS = [UP, DOWN, LEFT, RIGHT];

const FPS = 60;
let CURRENTFRAME = 0;

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

const preloadImages = Object.values(objectData).filter(a=>a.art!=='goal').map(a => 'images/' + a.art + '.png');
/* No more need for this array!
const preloadImages = [
    "images/babababa.png",
    "images/wall.png",
    "images/numbers.png",
    "images/plus.png",

    "images/text_baba.png",
    "images/text_is.png",
    "images/text_you.png",
    "images/text_wall.png",
    "images/text_stop.png",
    "images/text_number.png",
    "images/text_push.png",
];
*/

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

function makeFullscreen() {
    if (canvas.requestFullscreen) canvas.requestFullscreen();
    else if (canvas.webkitRequestFullscreen) canvas.webkitRequestFullscreen();
    else if (canvas.msRequestFullscreen) canvas.msRequestFullscreen();
}

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
    checkSentences();

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
    if (CURRENTFRAME % Math.floor(FPS/8) === 0)
        for (const o of objects.filter(o => o.isAttribute('win'))) {

        const randomBetween = (a, b) => ((b-a)*Math.random()+a);
        const randomAngle = () => randomBetween(0, 2*Math.PI);
        const randomVels = [1, 2].map(a=>{
            const angle = randomAngle();
            const r = randomBetween(0.3, 0.7);
            return { vx: r*Math.cos(angle), vy: r*Math.sin(angle) };
        });

        for (const vel of randomVels) {
            newParticle('particle_win', o.p, "sparkle", 12, vel, 1000/FPS*16, '#ffe600');
        }
    }
    draw();

    CURRENTFRAME++;
    const elapsed = Date.now() - start;
    if (elapsed < 1000/FPS) setTimeout(() => requestAnimationFrame(frame), 1000/FPS - elapsed);
    else requestAnimationFrame(frame);
}



function draw() {
    ctx.fillStyle = "BLACK";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "WHITE";

    // Render Particles/Trail
    for (const p of particles) {
        let art = `images/${objectData[p.getObject()].art}.png`;
        let pos = p.getPosition();

        const size = Math.max(1, p.size / p.maxLife * p.life);
        drawParticle(art, {rx: (pos.x + 0.5) * TILESIZE, ry: (pos.y + 0.5) * TILESIZE}, p.tint, size);
    }

    // Render Objects
    for (const o of objects) {
        let oData = objectData[o.getObject()];
        let art = `images/${oData.art}.png`;

        if (!preloadImages.includes(art)) continue;

        // exception for unfinished art
        // Aight buh
        if (['wall'].includes(o.getObject())) {
            
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
    // no more addRule calls needed! But I kept the code in here as comments just because why delete them

    newObject(1, 1, "baba");
    //addRule('baba', 'is', 'you');
    
    newObject(3, 3, "wall");
    
    //addRule('wall', 'is', 'stop');
    
    newObject(3, 5, 'add');
    //addRule('add', 'is', 'push');
    
    writeSentence('baba is you', 4, 1);
    
    for (let i = 0; i < levelw; i++) newObject(i, levelh-2, 'wall');
    writeSentence('wall is stop', 0, levelh-1);
    
    newObject(5, 5, "number1");
    newObject(1, 5, 'number1');
    writeSentence('number is push', 3, levelh-1);

    writeSentence('operator is win', 6, levelh-1);

    //newObject(3, 5, 'win');

    // Promise stuff for image loading BEFORE running the game.
    Promise.all(preloadImages.map(preloadImage))
    .then(() => {
        requestAnimationFrame(frame);
        checkSentences();
        checkEquations();
    });
}
init();