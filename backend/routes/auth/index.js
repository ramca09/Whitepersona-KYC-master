const express = require("express");

const signUpRoutes = require("./signup");
const loginRoutes = require("./login");

const router = express.Router();

const AuthRoutes = (db) => {
    router.use("/signup", signUpRoutes(db));
    router.use("/login", loginRoutes(db));

    return router;
};

module.exports = AuthRoutes;
