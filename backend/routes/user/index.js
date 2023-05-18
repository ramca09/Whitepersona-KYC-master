const express = require("express");

const inquiryRoutes = require("./inquiry");

const router = express.Router();

const UserRoutes = (db) => {
    router.get("/me", (req, res) => {
        res.status(200).send({ user: req.user });
    });

    router.get("/:email", (req, res) => {
        db.query(`SELECT * FROM tbl_users WHERE email=${db.escape(req.params.email)}`, (error, result) => {
            if (error || !result.length) return res.status(404).send({ msg: "User not found!" });

            res.status(200).send({ user: result[0] });
        });
    });

    router.put("/", (req, res) => {
        const data = req.body.data;
        if (data === undefined) return res.status(400).send({ msg: "No data to save!" });

        db.query(`SELECT * FROM tbl_users WHERE id='${data.id}'`, (error, result) => {
            if (error || !result.length) return res.status(404).send({ msg: "User not found!" });
            if (result[0]["email_status"] === 0) return res.status(400).send({ msg: "Email not verified yet!" });

            db.query(
                `UPDATE tbl_users SET ? WHERE id='${result[0]["id"]}'`,
                {
                    email: data.email,
                    first_name: data.firstName,
                    last_name: data.lastName,
                    referred_by: data.referredBy,
                    middle_name: data.middleName,
                    company_name: data.companyName,
                    job_title: data.jobTitle,
                    telephone: data.telephone,
                    mobile_phone: data.mobilePhone,
                    country_of_residence: data.countryOfResidence,
                    state_or_province: data.stateOrProvince,
                    building_number: data.buildingNumber,
                    city: data.city,
                    postal_code: data.postalCode,
                    address: data.address,
                    date_of_birth: data.dateOfBirth,
                    nationality: data.nationality,
                    city_of_birth: data.cityOfBirth,
                    gender: data.gender,
                    is_us: data.isUSPerson,
                    service: data.service,
                },
                (error) => {
                    if (error) return res.status(500).send({ msg: "Error while saving kyc!", error });
                    res.status(200).send({ msg: "Kyc Form Saved" });
                }
            );
        });
    });

    router.get("/country/all", (req, res) => {
        console.log(`Fetched countries from ${req.user.email}`);

        db.query(`SELECT * FROM tbl_countries ORDER BY tbl_countries.country_name ASC`, (error, results) => {
            if (error || !results.length) return res.status(404).send({ msg: "No country data found!" });

            res.status(200).send({ countries: results });
        });
    });

    router.use("/inquiry", inquiryRoutes(db));

    return router;
};

module.exports = UserRoutes;
