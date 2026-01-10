const objectData = {
    baba: {
        art : "babababa",
        TYPE : "noun",
    },
    wall: {
        art : "wall",
        TYPE : "noun",
    },
    goal: {
        art : "goal",
        TYPE : "noun",
    },
    win: {
        art : "win",
        TYPE : "attribute",
    },
    push: {
        art : "push",
        TYPE : "attribute",
    },
    stop: {
        art: "stop",
        TYPE: "attribute",
    },

    is: {
        art : "goal",
        TYPE : "verb",
    },
    add: {
        output : function(i1,i2){return i1 + i2;},
        art : "plus",
        TYPE : "operator",
    },

    number1: {
        art : "numbers",
        TYPE : "value",
        val: 1,
    },
}