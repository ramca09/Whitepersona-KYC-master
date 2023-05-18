const isEmpty = require("../../utils/is-empty");

const validateLoginPayload = (payload) => {
    const errors = {};

    if (isEmpty(payload.email)) errors.email = "Email is required!";

    if (isEmpty(payload.password)) errors.password = "Password is required!";

    return { errors, isValid: isEmpty(errors) };
};

module.exports = validateLoginPayload;
