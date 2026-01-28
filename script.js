const canvas = document.querySelector('canvas');
const ctx = canvas.getContext("2d");

const TILESIZE = 24;
const levelw = 12;
const levelh = 12;
const SCALINGFACTOR = 2;

canvas.width = levelw * TILESIZE * SCALINGFACTOR;
canvas.height = levelh * TILESIZE * SCALINGFACTOR;
ctx.imageSmoothingEnabled = false;
ctx.scale(SCALINGFACTOR, SCALINGFACTOR);

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

// state stuff
let turnInProgress = false;
const inputQueue = [];

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

    checkEquations();
    checkSentences();
}

function endTick() {
    for (const o of objects) {
        o.vP.x = o.p.x;
        o.vP.y = o.p.y;
    }

    


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


    // =============================== WIN PARTICLES ================================== //

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

        //Don't tint at all. filtered images are really hard on performance
        let tint = null;
        if (['wall'].includes(o.getObject())) {
            
            drawImageAt(art, o.vP,tint);
            continue;
        }
        if (false && oData.TYPE!='noun'){//later, check if the object is in a sequence

            tint = "gray"
        }
        const frame = Math.floor((Date.now()/200)%3);
        
        if (['number', 'operator', 'text'].some(t => rulesMapping[t](o.getObject()))) {
            const baseColor = oData.color ?? "#ffffff";
            let finalColor = clr => o.active ? clr : changeLightness(clr, -0.4);
            
            const numbermaybe = rulesMapping.number(o.getObject());
            if (numbermaybe) {
                drawImageInSheet(art, o.vP, oData.val, frame, finalColor('#ffffff'));
            }

            else if (oData.style && oData.style === 'directional') {
                drawImageInSheet(art, o.vP, DIRECTIONS.indexOf(o.facing), frame, finalColor('#ffffff'));
            }

            else drawImageAtFrame(art, o.vP, frame, finalColor(baseColor));
            continue;
        }

        drawImageAtFrame(art, o.vP, frame,tint);
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

    newObject(7, 5, 'text_therefore');
    
    writeSentence('baba is you', 4, 1);
    
    for (let i = 0; i < levelw; i++) newObject(i, levelh-2, 'wall');
    writeSentence('wall is stop', 0, levelh-1);
    
    newObject(5, 5, "number1");
    newObject(1, 5, 'number1');
    writeSentence('number is push', 3, levelh-1);

    writeSentence('operator is win', 6, 3);


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
//navigator.clipboard.writeText(parseLevel(objects));