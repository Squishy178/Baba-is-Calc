const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
var player = {
    x:0,vX:0,
    y:0,vY:0,
    d:0,
}
var objects = []
function newObject(x,y,type){
    objects.push(
        {
            x:x,y:y,vX:x,vY:y,
            type:type,
        });
}

const FPS = 60;
function lerp(start, end, t){
    return start + (end - start) * t;
};
// Images. Javascript seems to hate them but whatever
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
    "images/babababa.png",
    "images/goal1.png",
    "images/goal2.png",
    "images/goal3.png",
    "images/wall1.png",

    "images/number1.png",
    "images/number2.png",
    "images/number3.png",

    "images/number11.png",
    "images/number12.png",
    "images/number13.png",

    "images/number21.png",
    "images/number22.png",
    "images/number23.png",

    "images/number31.png",
    "images/number32.png",
    "images/number33.png",

    "images/number41.png",
    "images/number42.png",
    "images/number43.png",

    "images/number51.png",
    "images/number52.png",
    "images/number53.png",
    
    "images/number61.png",
    "images/number62.png",
    "images/number63.png",

    "images/number71.png",
    "images/number72.png",
    "images/number73.png",

    "images/number81.png",
    "images/number82.png",
    "images/number83.png",

    "images/number91.png",
    "images/number92.png",
    "images/number93.png",
]
// Keys and all that garbage
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
function collide(x1,y1,x2,y2){
    return x1==x2 && y1==y2;
}
function getObjectAt(x, y) {
    return objects.find(o => o.x === x && o.y === y);
}
function tick(){
    if (keysDown['ArrowUp']) player.y -= 1;
    if (keysDown['ArrowDown']) player.y += 1;
    if (keysDown['ArrowLeft']) player.x -= 1;
    if (keysDown['ArrowRight']) player.x += 1;

    player.vX = lerp(player.vX,player.x,0.4);
    player.vY = lerp(player.vY,player.y,0.4);
    if (Math.abs(player.vX-player.x) < 0.05) player.vX = player.x
    if (Math.abs(player.vY-player.y) < 0.05) player.vY = player.y
    
    let o = getObjectAt(player.x,player.y);
    if (o){
        let oData = objectData[o.type];
        if (collide(player.x,player.y,o.x,o.y)){
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
    for (o of objects){
        o.vX = lerp(o.vX,o.x,0.4);
        o.vY = lerp(o.vY,o.y,0.4);
    }
    
    // Simulate the One Click. Stupid that it repeats, but works mostly
    for (i in keysDown){
        keysDown[i]=false;
    }
    checkEquations();
    draw();
    
}
function checkEquations(){
    for (let o of objects){
        let oData = objectData[o.type]
        let length = 1;
        if (oData.TYPE == "number"){
            value = oData.val;
        }else{
            value = 0;
        }
        let operation = null;
        while (getObjectAt(o.x + length,o.y)){
            let o2 = getObjectAt(o.x + length,o.y);
            let o2Data = objectData[o2.type];

            if (o2Data.TYPE == "wall" || o2Data.TYPE == "object"){
                break;
            }else if (o2Data.TYPE == "value"){
                value = operation(oData.val,o2Data.val);
            }else if (o2Data.TYPE == "operation"){
                operation = o2Data.output;
            }
        }
        console.log(value);
    }
    // ye olde script that was unfinished 
    
    // let equations = [];
    // for (let y = 0; y < gridHeight; y++) {
    //     for (let x = 0; x < gridWidth; x++) {
    //         for (o of objects){
    //             if (collide(o.x,o.y,x,y)){
    //                 equations.push({x:x,y:y,return:})
    //             }
    //         }
    //     }
    // }
    // for (let i = 0; i < equations.length; i++){
    //     for (let ii = 0; ii < equations[i].length; ii++){
    //         if (o.x == equations[i][ii].x && o.y == equations[i][ii]){
                
    //         }
    //     }
    // }
}

function draw(){
    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = "BLACK";
    ctx.fillRect(0,0,288,288);
    ctx.fillStyle = "WHITE";
    
    ctx.drawImage(getImage("images/babababa.png"),player.vX * 24,player.vY * 24,24,24);

    for (o of objects){
        let oData = objectData[o.type];
        let art = "images/"+oData.art+"1.png";
        if (!oData.static){
           art = "images/"+oData.art+(Math.floor((Date.now()/200)%3+1))+".png";
        }
        ctx.drawImage(getImage(art),o.vX * 24,o.vY * 24,24,24);
    }
}
function init(){
    for (var i = 0; i < preloadImages.length; i++){
        preloadImage(preloadImages[i]);
    }
    newObject(3,3,"wall");

    newObject(5,3,"number1");
    setInterval(tick,1000/FPS);
    // setInterval(function(){
    //     player.x += 1;
    // },1000);
    
}
init();