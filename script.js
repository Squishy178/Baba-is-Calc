const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
var player = {
    x:0,vX:0,
    y:0,vY:0,
    d:0,
}
const FPS = 60;
var loadedImages={};
function preloadImage(url){
    let img=new Image();
    img.src=url;
    loadedImages[url]=img;
}
function getImage(url) {
    return loadedImages[url];
}
const preloadImages = [
    "babababa.png",
]
// Key garbage
const keys = {};
var keysDown= {};
window.addEventListener('keydown', (e) => {
    keys[e.code] = true;
    keysDown[e.code] = true;
});

window.addEventListener('keyup', (e) => {
    keys[e.code] = false;
    keysDown[e.code] = false;
});

function tick(){
    if (keysDown['ArrowUp']) player.y -= 1;
    if (keysDown['ArrowDown']) player.y += 1;
    if (keysDown['ArrowLeft']) player.x -= 1;
    if (keysDown['ArrowRight']) player.x += 1;

    player.vX = lerp(player.vX,player.x,0.4);
    player.vY = lerp(player.vY,player.y,0.4);
    draw();
    for (let i=0; i<keysDown;i++){
        keysDown[i] = false;
    }
}
function lerp(start, end, t){
    return start + (end - start) * t;
};
function draw(){
    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = "BLACK";
    ctx.fillRect(0,0,256,256);
    ctx.fillStyle = "WHITE";
    ctx.drawImage(getImage("babababa.png"),player.vX * 16,player.vY * 16,16,16);

}
function init(){
    for (var i = 0; i < preloadImages.length; i++){
        preloadImage(preloadImages[i]);
    }
    setInterval(tick,1000/FPS);
    // setInterval(function(){
    //     player.x += 1;
    // },1000);
    
}
init();