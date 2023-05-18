const express = require("express");

const router = express.Router();

const InquiryRoutes = (db) => {
    router.put("/:id", (req, res) => {
        db.query(`SELECT * FROM tbl_users WHERE id='${req.params.id}'`, (error, result) => {
            if (error || !result.length) return res.status(404).send({ msg: "User not found!" });
            if (result[0]["email_status"] === 0) return res.status(400).send({ msg: "Email not verified yet!" });

            db.query(`UPDATE tbl_users SET ? WHERE id='${req.params.id}'`, { KYC_inquiry_id: req.body.inquiryId, status: 2 }, () => {
                res.status(200).send({ msg: "Inquiry Updated" });
            });
        });
    });
    return router;
};

module.exports = InquiryRoutes;
