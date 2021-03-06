const logger = require("../boot/logs_manager");

module.exports = (error, req, res, next) => {
    logger.error(error.message);
    res.json(
        process.env.NODE_ENV === "developement"
        ? {
            msg: error.message,
            stack: error.stack,
        }
        :{
            message: "something went wrong",
        }
    );
};