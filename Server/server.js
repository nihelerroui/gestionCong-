require('dotenv').config({path: "./config/.env"});
const express = require("express");
//Initialisation de l'application 
const app = express();

//Loading requirements
require("./boot/logs_manager");
require("./boot/routes")(app);
require("./boot/database")();
require("./boot/validation")();
//Définition du PORT
const PORT = process.env.PORT || 5000 ;

//Attendre un appel pour le serveur
app.listen(PORT, () =>
    console.log(`App is running on http://localhost:${PORT}`)
);

