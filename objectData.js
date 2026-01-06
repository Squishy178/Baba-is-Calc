const objectData = {
    wall:{
        art : "wall", static : true,
        pushable : false,
        TYPE : "wall",
    },
    goal:{
        art : "goal", static : false,
        pushable : true,
        TYPE : "object",
    },
    add:{
        output : function(i1,i2){return i1 + i2;},
        art : "goal", static : false,
        pushable : true,
        TYPE : "operator",
    },
    is:{
        art : "goal", static : false,
        pushable : true,
        TYPE : "logic",
    },

    number1:{
        art : "number1", static : false,
        pushable : true,
        TYPE : "value",
        val: 1,
    },

}