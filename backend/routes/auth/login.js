const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const validateLoginPayload = require("../../validations/auth/login");

const router = express.Router();

const LoginRoutes = (db) => {
    router.post("/", (req, res) => {
        const { errors, isValid } = validateLoginPayload(req.body);

        if (!isValid) return res.status(400).send({ msg: errors });

        db.query(`SELECT * FROM tbl_users WHERE email=${db.escape(req.body.email)}`, (error, result) => {
            if (error || !result.length) return res.status(404).send({ msg: "User not found!" });
            if (result[0]["status"] === 0) return res.status(400).send({ msg: "Reset your password first!" });
            if (result[0]["email_status"] === 0) return res.status(400).send({ msg: "Email not verified yet!" });

            bcrypt.compare(req.body.password, result[0]["password"]).then((success) => {
                if (!success) return res.status(400).send({ msg: "Incorrect password!" });

                const token = jwt.sign({ email: req.body.email }, process.env.JWT_SECRET, {
                    expiresIn: 86400, // expires in 24 hours
                });
                return res.status(200).send({ msg: "success", token });
            });
        });
    });

    return router;
};

module.exports = LoginRoutes;
