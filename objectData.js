const objectData = {
    /*============================== Nouns/Entities ==============================*/

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
    
    /*============================== Text ==============================*/
    
    text_baba: {
        art : "text_baba",
        TYPE : "subject",
    },

    text_win: {
        art : "text_win",
        TYPE : "attribute",
    },
    
    text_is: {
        art : "text_is",
        TYPE : "verb",
    },
    
    text_you: {
        art : "text_you",
        TYPE : "object",
    },
    
    text_win: {
        art : "win",
        TYPE : "object",
    },
    text_wall: {
        art : "text_wall",
        TYPE : "subject",
    },
    text_push: {
        art : "text_push",
        TYPE : "object",
    },
    text_stop: {
        art : "text_stop",
        TYPE : "object",
    },

    text_number: {
        art : "text_number",
        TYPE : "subject",
    },

    /*============================== Math ==============================*/

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
        output : function(i1,i2){return Math.pow(i1, i2);}, // this operator (^) IS NOT EXPONENTIATION in Javascript, it is the bitwise XOR lmao
        art : "goal",
        TYPE : "operator",
    },
    mod:{
        output : function(i1,i2){return i1 % i2;},
        art : "goal",
        TYPE : "operator",
    },

}
