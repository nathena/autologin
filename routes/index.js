
module.exports = function(router){

    require("./xmfish")(router);
    require("./s917")(router);
    require("./anjuke")(router);
    require("./baixing")(router);
    require("./fang")(router);
    require("./ganji")(router);
    require("./s58")(router);

    return router;
};



