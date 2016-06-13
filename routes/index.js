
module.exports = function(router){

    require("./xmfish")(router);
    require("./s917")(router);

    return router;
};



