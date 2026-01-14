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

            length++;
        }

        allEquations = allEquations.concat(eqs);
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

function checkSentences() {
    let allSentences = [];

    function tryNext(sentence, o) {
        const { words, lastType } = sentence;
        const type = o.getType();

        if (!["subject", "object", "verb", "preposition"].includes(type)) return null;

        
        const ruleVal = o.getObject().match(/(?<=text_)\w+/g)[0];
        
        if (type === "subject" && lastType !== "verb") return null;
        else if (type === "verb" && lastType !== "subject") return null;
        else if (type === "object" && lastType !== "verb") return null;

        return {
            words: [...words, ruleVal],
            lastType: type,
        };
    }

    for (let o of getObjectsOfType('subject')) {
        let oData = objectData[o.getObject()];

        let length = 1;
        let sents = [{
            words: [o.getObject().split('_')[1]],
            lastType: "subject",
        }];
        
        while (true) {
            const np = {x: o.p.x + length, y: o.p.y};
            const objects2 = findEntitiesAt(np);
            if (objects2.length === 0) break;

            const nextSent = [];
            for (const sent of sents) {
                for (const o2 of objects2) {
                    const extended = tryNext(sent, o2);
                    if (extended !== null) nextSent.push(extended);
                    else nextSent.push(sent);
                }
            }

            sents = nextSent;
            length++;
        }

        allSentences = allSentences.concat(sents);
    }

    Object.keys(rules).forEach(k => rules[k] = []);
    for (const { words: sentence, lastType: typ } of allSentences) {
        console.log(sentence);
        addRule(...sentence);
    }
}