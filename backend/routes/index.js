const express = require("express");

const authRoutes = require("./auth");
const emailRoutes = require("./email");
const userRoutes = require("./user");
const authenticate = require("./middleware/authenticate");
const sendEmail = require("../utils/send-email");

const router = express.Router();

const Routes = (db) => {
    router.post("/kyc-success/:id", (req, res) => {
        db.query(`SELECT * FROM tbl_users WHERE id='${req.params.id}'`, (error, result) => {
            if (error || !result.length) return res.status(404).send({ msg: "User not found!" });
            if (result[0]["email_status"] === 0) return res.status(400).send({ msg: "Email not verified yet!" });

            sendEmail(result[0]["email"], "KYC Completed", "Thank you for completing your KYC.");
        });
    });

    router.use("/auth", authRoutes(db));
    router.use("/email", emailRoutes(db));
    router.use("/user", authenticate(db), userRoutes(db));

    return router;
};

module.exports = Routes;
