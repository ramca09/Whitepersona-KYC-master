const express = require("express");
const bcrypt = require("bcryptjs");

const validateSignUpPayload = require("../../validations/auth/signup");
const isEmpty = require("../../utils/is-empty");

const router = express.Router();

const SignUpRoutes = (db) => {
    router.post("/", (req, res) => {
        const { errors, isValid } = validateSignUpPayload(req.body);

        if (!isValid) return res.status(400).send({ msg: errors });

        db.query(`SELECT * FROM tbl_users WHERE email='${req.body.email}'`, (error, result) => {
            if (error) return res.status(400).send({ msg: "Error while signing user!", error });
            if (result.length) return res.status(400).send({ msg: "Email already signed by other user!" });

            bcrypt.hash(req.body.password, 10).then((hash) => {
                if (isEmpty(req.body.referredBy)) req.body.referredBy = "";

                db.query(
                    `INSERT INTO tbl_users (password,email,first_name,last_name,referred_by) VALUES (${db.escape(hash)},${db.escape(req.body.email)},'${
                        req.body.firstName
                    }','${req.body.lastName}','${req.body.referredBy}')`,
                    (error) => {
                        if (error) return res.status(400).send({ msg: "Error while signing user!", error });
                        else res.status(201).send({ msg: "User registered" });
                    }
                );
            });
        });
    });

    return router;
};

module.exports = SignUpRoutes;
