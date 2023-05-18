const nodemailer = require("nodemailer");
const sesTransport = require("nodemailer-ses-transport");

const sendEmail = (email, subject, html) => {
    return new Promise((resolve, reject) => {
        let mail;
        if (process.env.AWS_REGION === undefined) {
            mail = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.SENDER_EMAIL,
                    pass: process.env.SENDER_APP_PASS,
                },
                secure: false,
            });
        } else {
            mail = nodemailer.createTransport(
                sesTransport({
                    region: process.env.AWS_REGION,
                    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
                })
            );
        }

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject,
            html,
        };

        mail.sendMail(mailOptions)
            .then((info) => {
                resolve();
                console.log(info);
            })
            .catch((error) => {
                reject(error);
            });
    });
};

module.exports = sendEmail;
