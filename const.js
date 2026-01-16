const UP = { x: 0, y: -1 };
const DOWN = { x: 0, y: 1 };
const LEFT = { x: -1, y: 0 };
const RIGHT = { x: 1, y: 0 };
const DIRECTIONS = [UP, DOWN, LEFT, RIGHT];

const FPS = 60;
let CURRENTFRAME = 0;

function lerp(start, end, t) {
    return start + (end - start) * t;
}

// Images. Javascript seems to hate them but whatever
var loadedImages = {};

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

const preloadImages = Object.values(objectData)
    .filter((a,i)=>a.art!=='goal' || Object.keys(objectData)[i]==='goal')
    .map(a => 'images/' + a.art + '.png');
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
const undoStack = [];

function saveState() {
    const state = objects.map(o => ({
        obj: o.getObject(),
        p: { x: o.p.x, y: o.p.y },
        facing: o.facing,
    }));
    return state;
}
``
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

function makeFullscreen() {
    if (canvas.requestFullscreen) canvas.requestFullscreen();
    else if (canvas.webkitRequestFullscreen) canvas.webkitRequestFullscreen();
    else if (canvas.msRequestFullscreen) canvas.msRequestFullscreen();
}``