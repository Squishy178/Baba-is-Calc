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
        art : "number1",
        TYPE : "subject",
    },

    /*============================== Math ==============================*/

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