function checkEquations(){
    let allEquations = [];
    
    for (let o of getObjectsOfType("value")) {
        let oData = objectData[o.getObject()];
        
        const eqs = [[o]];
        let length = 1;
        let lastType = "value";
        for (let xv of [1,0]) {
            while (findEntitiesAt({x: o.p.x + length * xv, y: o.p.y + length * (1-xv)}).length > 0 && eqs.length > 0) {
                let objects2 = findEntitiesAt({x: o.p.x + length, y: o.p.y + length * (1-xv)});

                const currentEq = eqs.pop();
                
                for (const o2 of objects2) {
                    const cloneEq = [...currentEq];
                    let o2Data = objectData[o2.getObject()];

                    if (!["number", "operator"].some(t => rulesMapping[t](o2.getObject()))) { // invalid expression
                        eqs.push(cloneEq);
                        continue;
                    }

                    if (o2Data.TYPE === "value"){
                        cloneEq.push(o2);
                        lastType = "value";
                    }
                    else if (o2Data.TYPE === "operator") {
                        if (lastType === "operator") continue; // Invalid expression

                        cloneEq.push(o2);
                        lastType = "operator";
                    }

                    eqs.push(cloneEq);
                }

                length++;
            }
        }
        allEquations = allEquations.concat(eqs);
    }

    function isValidEquation(eq) {
        // EXPAND LOGIC LATER
        return (eq.length >= 3);
    }

    for (const o of objects.filter(o => ['number', 'operator'].some(t => rulesMapping[t](o.getObject())))) {
        o.active = allEquations
            .filter(isValidEquation)
            .some(eq => eq.includes(o));
    }
    
    const parseAllEqs = arr => arr.map(o => {
        const oObj = o.getObject();
        if (rulesMapping.number(oObj)) return objectData[oObj].val;
        else if (rulesMapping.operator(oObj)) return objectData[oObj].output;
    });

    const result = allEquations.filter(arr => arr.length >= 3).map(parseAllEqs).map(evaluateExpression);
    if (result) console.log(result);

    function evaluateExpression(expr) {
        const vals = [], opers = [];
        let lastType = null;
        for (const item of expr) {
            if (typeof item === "number") {
                if (lastType === "value") {
                    const currentVal = vals.pop();
                    vals.push(Number(toString(currentVal) + toString(item)));
                }
                else vals.push(item);

                if (vals.length === 2 && opers.length === 1) {
                    const val2 = vals.pop();
                    const val1 = vals.pop();
                    const oper = opers.pop();
                    vals.push(oper(val1, val2));
                }
                
                lastType = "value";
            }
            else if (typeof item === "function") {
                if (lastType === "operator") return NaN; // invalid expression
                opers.push(item);
                lastType = "operator";
            }
        }

        return vals[0];
    }

}

function checkSentences() {
    let allSentences = [];

    function tryNext(sentence, o) {
        const { words, lastType } = sentence;
        const type = o.getType();

        if (!["subject", "object", "verb", "preposition"].includes(type)) return null;

        
        
        if (type === "subject" && lastType !== "verb") return null;
        else if (type === "verb" && lastType !== "subject") return null;
        else if (type === "object" && lastType !== "verb") return null;

        return {
            words: [...words, o],
            lastType: type,
        };
    }
    
    for (let o of getObjectsOfType('subject')) {
        let oData = objectData[o.getObject()];

        let length = 1;
        let sents = [{
            words: [o],
            lastType: "subject",
        }];
        for (let xv of [1,0]) {
            while (true) {
                const np = {x: o.p.x + length * xv, y: o.p.y + length * (1-xv)};
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

                sents = [...new Set(nextSent)];
                length++;
            }
        }
        allSentences = allSentences.concat(sents);
    }

    function isValidSentence(sent) {
        // EXPAND LOGIC LATER
        return (sent.words.length >= 3);
    }

    allSentences = allSentences.filter(isValidSentence);
    
    for (const o of objects.filter(o => rulesMapping.text(o.getObject()))) {
        o.active = allSentences.some(sent => sent.words.includes(o));
    }


    Object.keys(rules).forEach(k => rules[k] = []);
    allSentences = allSentences.map(sent => ({ words: sent.words.map(o => o.getObject().match(/(?<=text_)\w+/g)[0]), lastType: sent.lastType }));
    for (const { words: sentence, lastType: typ } of allSentences) {
        console.log(sentence);
        addRule(...sentence);
    }
}