function checkEquations(){
    let allEquations = [];
    
    for (let o of getObjectsOfType("value")) {
        let oData = objectData[o.getObject()];
        
        const eqs = [[oData.val]];
        let length = 1;
        let lastType = "value";

        while (findEntitiesAt({x: o.p.x + length, y: o.p.y}).length > 0 && eqs.length > 0) {
            let objects2 = findEntitiesAt({x: o.p.x + length, y: o.p.y});

            const currentEq = eqs.pop();
            
            for (const o2 of objects2) {
                const cloneEq = [...currentEq];

                let o2Data = objectData[o2.getObject()];

                if (!["value", "operator"].includes(o2Data.TYPE)) continue; // invalid expression

                if (o2Data.TYPE === "value"){
                    if (lastType === "value") {
                        let currentVal = currentEq.pop();
                        currentVal = Number(toString(currentVal) + toString(o2Data.val));
                        cloneEq.push(currentVal);
                    }
                    else {
                        cloneEq.push(o2Data.val);
                    }
                    lastType = "value";
                }
                else if (o2Data.TYPE === "operator") {
                    if (lastType === "operator") continue; // Invalid expression

                    cloneEq.push(o2Data.output);
                    lastType = "operator";
                }

                eqs.push(cloneEq);
            }

            allEquations = allEquations.concat(eqs);
            length++;
        }
    }

    const result = allEquations.filter(arr => arr.length >= 3).map(evaluateExpression);
    if (result) console.log(result);

    function evaluateExpression(expr) {
        const vs = [], opers = [];
        let lastType = null;
        for (const item of expr) {
            if (typeof item === "number") {
                if (lastType === "value") {
                    const currentVal = vs.pop();
                    vs.push(Number(toString(currentVal) + toString(item)));
                }
                else vs.push(item);

                if (vs.length === 2 && opers.length === 1) {
                    const val2 = vs.pop();
                    const val1 = vs.pop();
                    const oper = opers.pop();
                    vs.push(oper(val1, val2));
                }
                
                lastType = "value";
            }
            else if (typeof item === "function") {
                if (lastType === "operator") return NaN; // invalid expression
                opers.push(item);
                lastType = "operator";
            }
        }

        return vs[0];
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