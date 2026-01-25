const objectData = {
    /*============================== Nouns/Entities ==============================*/

    baba: {
        art : "babababa",
        TYPE : "noun",
        style : "static",
    },
    wall: {
        art : "wall",
        TYPE : "noun",
        style : "frozen",
    },
    goal: {
        art : "goal",
        TYPE : "noun",
        style : "static",
    },
    
    /*============================== Text ==============================*/
    
    text_baba: {
        art : "text_baba",
        TYPE : "subject",
        style : "static",
        color : "#ff0073",
    },
    
    text_is: {
        art : "text_is",
        TYPE : "verb",
        color : "#ffffff",
    },
    
    text_you: {
        art : "text_you",
        TYPE : "object",
        color : "#ff0073",
    },
    
    text_win: {
        art : "text_win",
        TYPE : "object",
        color : "#fffa6a",
    },
    text_wall: {
        art : "text_wall",
        TYPE : "subject",
        color : "#282867",
    },
    text_push: {
        art : "text_push",
        TYPE : "object",
        color : "#926335",
    },
    text_stop: {
        art : "text_stop",
        TYPE : "object",
        color : "#395f39",
    },

    text_number: {
        art : "text_number",
        TYPE : "subject",
        color : "#ffffff",
    },
    text_operator: {
        art : "text_operator",
        TYPE : "subject",
        color : "#ffffff",
    },

    /*============================== Particles ==============================*/

    particle_win: {
        art : "particle_win",
        TYPE : "particle",
    },
    particle_dust: {
        art : "particle_dust",
        TYPE : "particle",
    },

    /*============================== Math ==============================*/

    number1: {
        art : "numbers",
        TYPE : "value",
        val: 1,
    },
    number2: {
        art : "numbers",
        TYPE : "value",
        val: 2,
    },
    number3: {
        art : "numbers",
        TYPE : "value",
        val: 3,
    },
    number4: {
        art : "numbers",
        TYPE : "value",
        val: 4,
    },
    number5: {
        art : "numbers",
        TYPE : "value",
        val: 5,
    },
    number6: {
        art : "numbers",
        TYPE : "value",
        val: 6,
    },
    number7: {
        art : "numbers",
        TYPE : "value",
        val: 7,
    },
    number8: {
        art : "numbers",
        TYPE : "value",
        val: 8,
    },
    number9: {
        art : "numbers",
        TYPE : "value",
        val: 9,
    },
    number0: {
        art : "numbers",
        TYPE : "value",
        val: 0,
    },

    add:{
        output : function(i1,i2){return i1 + i2;},
        art : "plus",
        TYPE : "operator",
        color : "#ffffff",
    },
    subtract:{
        output : function(i1,i2){return i1 - i2;},
        art : "goal",
        TYPE : "operator",
        color : "#ffffff",
    },
    multiply:{
        output : function(i1,i2){return i1 * i2;},
        art : "goal", 
        TYPE : "operator",
        color : "#ffffff",
    },
    divide:{
        output : function(i1,i2){return i1 / i2;},
        art : "goal",
        TYPE : "operator",
        color : "#ffffff",
    },
    pow:{
        output : function(i1,i2){return Math.pow(i1, i2);}, // this operator (^) IS NOT EXPONENTIATION in Javascript, it is the bitwise XOR lmao
        art : "goal",
        TYPE : "operator",
        color : "#ffffff",
    },
    mod:{
        output : function(i1,i2){return i1 % i2;},
        art : "goal",
        TYPE : "operator",
        color : "#ffffff",
    },

    text_therefore: {
        art : "text_therefore",
        TYPE : "verb",
        color : "#ffffff",
        style : "directional",
    },
    text_implies: {
        art : "goal",
        TYPE : "verb",
        color : "#ffffff",
    },
}
