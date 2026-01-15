const tintCanvas = document.createElement("canvas");
const tintCtx = tintCanvas.getContext("2d");

const setTintSize = (w, h) => {
    tintCanvas.width = w;
    tintCanvas.height = h;
    tintCtx.imageSmoothingEnabled = false;
    tintCtx.clearRect(0, 0, w, h);
}

function applyTint(drawFunc, x, y, w, h, tint) {
    setTintSize(w, h);

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
function shadeUpParticle(df, x, y, tint = undefined, size = TILESIZE) {
    if (!tint) {
        ctx.translate(x, y);
        df(ctx);
        ctx.translate(-x, -y);
    }
    else applyTint(
        df,
        x, y,
        size, size,
        tint
    );
}

function drawImageAt(img, { x, y }, tint = undefined) {
    const df = (c) => c.drawImage(getImage(img), 0, 0, TILESIZE, TILESIZE);
    shadeItUp(df, x, y, tint);
}

function drawImageAtFrame(img, { x, y }, f, tint = undefined) {
    const df = (c) => c.drawImage(getImage(img),
        f*24, 0,
        24, 24,
        0, 0,
        TILESIZE, TILESIZE
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

function drawParticle(img, { rx, ry }, tint = undefined, size = TILESIZE) {
    const df = (c) => c.drawImage(getImage(img), 0, 0, size, size);
    shadeUpParticle(df, rx - size/2, ry - size/2, tint, size);
}