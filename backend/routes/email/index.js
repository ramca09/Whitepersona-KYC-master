const express = require("express");
const randToken = require("rand-token");
const bcrypt = require("bcryptjs");

const sendEmail = require("../../utils/send-email");

const router = express.Router();

const EmailRoutes = (db) => {
    router.post("/send", (req, res) => {
        db.query(`SELECT * FROM tbl_users WHERE LOWER(email)=LOWER(${db.escape(req.query.email)})`, (error, result) => {
            if (error || !result.length) return res.status(404).send({ msg: "User not found!" });
            if (result[0]["email_status"] === 1) return res.status(200).send({ msg: "User already verified!" });

            const token = randToken.generate(20);
            sendEmail(
                req.query.email,
                "Email verification",
                `<p>You requested for email verification, kindly use this <a href="${process.env.SERVER_URI}/email/verify?token=${token}">link</a> to verify your email address</p>`
            )
                .then(() => {
                    db.query(`UPDATE tbl_users SET ? WHERE LOWER(email)=LOWER(${db.escape(req.query.email)})`, { token }, () => {
                        res.status(200).send({ msg: "Email sent" });
                    });
                })
                .catch((error) => res.status(500).send({ msg: error }));
        });
    });

    router.get("/verify", (req, res) => {
        db.query(`SELECT * FROM tbl_users WHERE token='${req.query.token}'`, (error, result) => {
            if (error || !result.length) return res.status(404).send({ msg: "User not found!" });
            if (result[0]["email_status"] === 0)
                db.query(`UPDATE tbl_users SET ? WHERE email='${result[0]["email"]}'`, { email_status: 1, token: "" }, (error) => {
                    if (error) return res.status(500).send({ msg: "Error while verifying email!" });
                    res.redirect(`${process.env.CLIENT_URI}`);
                });
            else res.redirect(`${process.env.CLIENT_URI}`);
        });
    });

    router.post("/forgot", (req, res) => {
        db.query(`SELECT * FROM tbl_users WHERE LOWER(email)=LOWER(${db.escape(req.query.email)})`, (error, result) => {
            if (error || !result.length) return res.status(404).send({ msg: "User not found!" });

            const token = randToken.generate(20);
            sendEmail(
                req.query.email,
                "Reset your password",
                `<p>You requested for being forgotten your password, kindly use this <a href="${process.env.CLIENT_URI}/auth/reset-password?token=${token}">link</a> to reset your password.</p>`
            )
                .then(() => {
                    db.query(`UPDATE tbl_users SET ? WHERE LOWER(email)=LOWER(${db.escape(req.query.email)})`, { token }, () => {
                        res.status(200).send({ msg: "Email sent" });
                    });
                })
                .catch((error) => res.status(500).send({ msg: error }));
        });
    });

    router.post("/prepare-reset", (req, res) => {
        db.query(`SELECT * FROM tbl_users WHERE token='${req.body.token}'`, (error, result) => {
            if (error || !result.length) return res.status(404).send({ msg: "User not found!" });

            if (result[0]["status"] !== 0)
                db.query(`UPDATE tbl_users SET ? WHERE email='${result[0]["email"]}'`, { password: "", status: "0" }, (error) => {
                    if (error) return res.status(500).send({ msg: "Error while resetting password!" });
                    res.status(200).send({ msg: "ok" });
                });
            else res.status(200).send({ msg: "ok" });
        });
    });

    router.post("/reset", (req, res) => {
        db.query(`SELECT * FROM tbl_users WHERE token='${req.query.token}'`, (error, result) => {
            if (error || !result.length) return res.status(404).send({ msg: "User not found!" });

            if (result[0]["status"] === 0)
                bcrypt.hash(req.body.password, 10).then((hash) => {
                    db.query(`UPDATE tbl_users SET ? WHERE email='${result[0]["email"]}'`, { password: hash, status: "1", token: "" }, (error) => {
                        if (error) return res.status(500).send({ msg: "Error while resetting password!" });
                        res.status(200).send({ msg: "success" });
                    });
                });
            else res.status(400).send({ msg: "Password already reset!" });
        });
    });

    return router;
};

module.exports = EmailRoutes;
