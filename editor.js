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

let selectedObject = 'baba';
Object.entries(objectData).forEach(([oname, odata], i) => {
    const optioncontainer = document.getElementById('objholder');

    const optiondiv = document.createElement('div');
    optiondiv.style.backgroundImage = `url(${preloadImages[i]})`;

    if (odata.TYPE === 'particle') return;
    if (odata.art === 'numbers') {
        optiondiv.classList.add('number-option');
        optiondiv.style.backgroundPositionY = `${-(odata.val * 48)}px`;
    }

    if (oname === 'wall') {
        optiondiv.classList.add('unfinished-option');
        optioncontainer.appendChild(optiondiv);
    }
    else setInterval(() => {
        const frame = Math.floor((Date.now()/200)%3);
        optiondiv.style.backgroundPositionX = `${-frame * 48}px`;
    });

    optiondiv.addEventListener('click', () => {
        selectedObject = oname;
        Array.from(optioncontainer.children).forEach(child => child.classList.remove('selected'));
        document.getElementById(oname).classList.add('selected');
    });
    optiondiv.id = oname;
    optioncontainer.appendChild(optiondiv);
});
document.getElementById(selectedObject).classList.add('selected');

const sliders = document.querySelectorAll('.slider');
sliders.forEach(slider => slider.value = 10);



// input stuff

canvas.addEventListener('click', e => {
    const rect = canvas.getBoundingClientRect();
    const mx = Math.floor((e.clientX - rect.left) / rect.width * levelw);
    const my = Math.floor((e.clientY - rect.top) / rect.height * levelh);
    console.log(selectedObject, mx, my);
    newObject(mx, my, selectedObject);
});



// drawing stuff

//================================ I COPIED ALL OF THIS FROM script.js BECAUSE ================================//
function draw() {
    ctx.fillStyle = "BLACK";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "WHITE";

    /*
    // Render Particles/Trail
    for (const p of particles) {
        let art = `images/${objectData[p.getObject()].art}.png`;
        let pos = p.getPosition();

        const size = Math.max(1, p.size / p.maxLife * p.life);
        drawParticle(art, {rx: (pos.x + 0.5) * TILESIZE, ry: (pos.y + 0.5) * TILESIZE}, p.tint, size);
    }
    */

    for (let x = 0; x < levelw; x++) {
        for (let y = 0; y < levelh; y++) {
            ctx.strokeStyle = "#ffffff22";
            ctx.strokeRect(x * TILESIZE, y * TILESIZE, TILESIZE, TILESIZE);
        }
    }
    ctx.strokeStyle = "BLACK";
    ctx.strokeRect(0, 0, levelw * TILESIZE, levelh * TILESIZE);

    // Render Objects
    for (const o of objects) {
        let oData = objectData[o.getObject()];
        let art = `images/${oData.art}.png`;

        if (!preloadImages.includes(art)) continue;

        // exception for unfinished art
        // Aight buh
        if (['wall'].includes(o.getObject())) {
            
            drawImageAt(art, o.p);
            continue;
        }
        const frame = Math.floor((Date.now()/200)%3);

        const numbermaybe = o.getObject().match(/(?<=number)\d+/g);
        if (numbermaybe) {
            drawImageInSheet(art, o.p, numbermaybe[0], frame, 'gray');
            continue;
        }

        drawImageAtFrame(art, o.p, frame);
    }
}

function frame() {
    const start = Date.now();

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    draw();

    const elapsed = Date.now() - start;
    if (elapsed < 1000/FPS) setTimeout(() => requestAnimationFrame(frame), 1000/FPS - elapsed);
    else requestAnimationFrame(frame);
}

function init() {
    Promise.all(preloadImages.map(preloadImage))
    .then(() => requestAnimationFrame(frame));
}
init();