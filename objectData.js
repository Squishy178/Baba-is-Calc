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

    number1: {
        art : "numbers",
        TYPE : "value",
        val: 1,
    },
    number2:{
        art : "numbers",
        TYPE : "value",
        val: 2,
    },
    number3:{
        art : "numbers",
        TYPE : "value",
        val: 3,
    },
    number4:{
        art : "numbers",
        TYPE : "value",
        val: 4,
    },
    number5:{
        art : "numbers",
        TYPE : "value",
        val: 5,
    },
    number6:{
        art : "numbers",
        TYPE : "value",
        val: 6,
    },
    number7:{
        art : "numbers",
        TYPE : "value",
        val: 7,
    },
    number8:{
        art : "numbers",
        TYPE : "value",
        val: 8,
    },
    number9:{
        art : "numbers",
        TYPE : "value",
        val: 9,
    },
    number0:{
        art : "numbers",
        TYPE : "value",
        val: 0,
    },
    add:{
        output : function(i1,i2){return i1 + i2;},
        art : "plus",
        TYPE : "operator",
    },
    subtract:{
        output : function(i1,i2){return i1 - i2;},
        art : "goal",
        TYPE : "operator",
    },
    multiply:{
        output : function(i1,i2){return i1 * i2;},
        art : "goal", 
        TYPE : "operator",
    },
    divide:{
        output : function(i1,i2){return i1 / i2;},
        art : "goal",
        TYPE : "operator",
    },
    pow:{
        output : function(i1,i2){return i1 ^ i2;},
        art : "goal",
        TYPE : "operator",
    },
    mod:{
        output : function(i1,i2){return i1 % i2;},
        art : "goal",
        TYPE : "operator",
    },

}
