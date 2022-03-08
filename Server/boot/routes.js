const cors = require("cors");
const error = require("../middleware/error");
const express = require("express");
const path = require("path");

//Routes
const auth = require("../routes/api/auth");
const user = require("../routes/api/user");
const service = require("../routes/api/service");
const notice = require ("../routes/api/notice");

module.exports = (app) => {
    app.use("/static", express.static(path.join(__dirname, "..", "public")));
    app.use(cors());
    app.use(error);
    app.use(express.json());
    app.use("/api/user", user);
    app.use("/api/service", service);
    app.use("/api/auth", auth);
    app.use("/api/notice", notice);
}