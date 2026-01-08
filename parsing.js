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