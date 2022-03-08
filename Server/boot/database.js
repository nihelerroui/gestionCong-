const mongoose = require('mongoose');
const logger = require('./logs_manager');
const debug = require('debug')("app:boot");

debug(`MONGO_URI : ${process.env.MONGO_URI}`);

module.exports = function () {
    //New database uri
    const dbURI = process.env.MONGO_URI ;
    // Attempt to connect to database
    mongoose.connect(dbURI, {
        useNewUrlParser: true,});
    //In Case of connection 
    mongoose.connection.on("connected", () =>
    logger.info(`mongoose is connected to the database`)
  );
    // In Case of error
  mongoose.connection.on("error", (err) =>
    debug(`Error connecting to db ${err}`)
  );
    //Disconnection from database
  mongoose.connection.on("disconnected", () => {
    debug(`Mongoose is disconnected`);
  });
   //Disconnection with exit process
  process.on("SIGINT", () => {
    debug("Mongoose disconnected on exit process");
    process.exit(0);
  }); 
}