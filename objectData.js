const objectData = {
    wall:{
        output : function(input){},
        art : "wall", static : true,
        pushable : false,
        TYPE : "object",
    },
    goal:{
        output : function(input){},
        art : "goal", static : false,
        pushable : true,
        TYPE : "object",
    },
    add:{
        output : function(input){},
        art : "goal", static : false,
        pushable : true,
        TYPE : "operator",
    },
    is:{
        output : function(input){},
        art : "goal", static : false,
        pushable : true,
        TYPE : "logic",
    },

    number1:{
        output : function(input){},
        art : "number", static : false,
        pushable : true,
        TYPE : "value",
    },
}