
module.exports = function(router){

    require("./xmfish")(router);
    require("./s917")(router);
    require("./anjuke")(router);
    require("./baixing")(router);

    return router;
};



