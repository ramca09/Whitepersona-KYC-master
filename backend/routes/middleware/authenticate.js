const jwt = require("jsonwebtoken");

const authenticate = (db) => {
    return (req, res, next) => {
        if (req.headers["authorization"] === undefined) return res.status(401).send({ msg: "Invalid Token!" });
        const token = req.headers["authorization"].replace(/^Bearer\s+/, "");

        if (!token) return res.status(403).send({ msg: "Invalid Token!" });

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
            if (!decoded || !decoded.email) return res.status(401).send({ msg: "Invalid Token!" });
        } catch (err) {
            return res.status(401).send({ msg: "Invalid Token!" });
        }

        db.query(`SELECT * FROM tbl_users WHERE email=${db.escape(decoded.email)}`, (error, result) => {
            if (error || !result.length) return res.status(404).send({ msg: "Unauthorized!" });

            req.user = result[0];
            next();
        });
    };
};

module.exports = authenticate;
