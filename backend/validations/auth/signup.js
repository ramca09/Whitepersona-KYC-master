const isEmpty = require("../../utils/is-empty");

const validateSignUpPayload = (payload) => {
    const errors = {};

    if (isEmpty(payload.password)) errors.password = "Password is required!";
    else if (payload.password.length > 25) errors.password = "Password must be shorter than 25 characters!";

    if (isEmpty(payload.email)) errors.email = "Email is required!";
    else if (payload.email.length > 30) errors.email = "Email must be shorter than 30 characters!";

    if (isEmpty(payload.firstName)) errors.firstName = "First name is required!";
    else if (payload.firstName.length > 20) errors.firstName = "First name must be shorter than 20 characters!";

    if (isEmpty(payload.lastName)) errors.lastName = "Last name is required!";
    else if (payload.lastName.length > 30) errors.lastName = "Last name must be shorter than 30 characters!";

    if (!isEmpty(payload.referredBy) && payload.referredBy.length > 20) errors.referredBy = "Referred by must be shorter than 20 characters!";

    return { errors, isValid: isEmpty(errors) };
};

module.exports = validateSignUpPayload;
