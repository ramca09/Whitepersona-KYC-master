import { Button, Container, Stack, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";

import TopBar from "../../components/TopBar";
import { useTranslation } from "react-i18next";

const UPPERCASE_REGEX = /(?=.*?[A-Z])/;
const LOWERCASE_REGEX = /(?=.*?[a-z])/;
const DIGITS_REGEX = /(?=.*?[0-9])/;
const SPECIAL_CHAR_REGEX = /(?=.*?[#?!@$%^&*-])/;
const MINIMUM_LENGTH_REGEX = /.{8,}/;

const ResetPasswordPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [isValidToken, setIsValidToken] = useState();
    const [passwordError, setPasswordError] = React.useState("");
    const [confirmPasswordError, setConfirmPasswordError] = React.useState("");
    const { register, handleSubmit } = useForm();
    // eslint-disable-next-line no-unused-vars
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        axios
            .post(`${process.env.REACT_APP_SERVER_URI}/email/prepare-reset`, { token: searchParams.get("token") })
            .then((response) => {
                if (response.data.msg === "ok") {
                    setIsValidToken(true);
                }
            })
            .catch((error) => {
                if (!error.response) alert("Backend server not running!");
                else alert(error.response.data.msg);
            });
    }, []);

    const onSubmit = (data) => {
        let isValid = false;
        if (data.password.length === 0) {
            setPasswordError("Password is empty");
        } else if (!UPPERCASE_REGEX.test(data.password)) {
            setPasswordError("At least one Uppercase");
        } else if (!LOWERCASE_REGEX.test(data.password)) {
            setPasswordError("At least one Lowercase");
        } else if (!DIGITS_REGEX.test(data.password)) {
            setPasswordError("At least one digit");
        } else if (!SPECIAL_CHAR_REGEX.test(data.password)) {
            setPasswordError("At least one Special Characters");
        } else if (!MINIMUM_LENGTH_REGEX.test(data.password)) {
            setPasswordError("At least minimum 8 characters");
        } else {
            isValid = true;
            setPasswordError("");
        }

        if (isValid) {
            if (data.password !== data.confirmPassword) {
                isValid = false;
                setConfirmPasswordError("Confirm password is not matched");
            } else {
                setConfirmPasswordError("");
            }
        }

        if (isValid) {
            axios
                .post(`${process.env.REACT_APP_SERVER_URI}/email/reset`, data, {
                    params: {
                        token: searchParams.get("token"),
                    },
                })
                .then((response) => {
                    if (response.data.msg === "success") navigate("/");
                })
                .catch((error) => {
                    if (!error.response) alert("Backend server not running!");
                    else alert(error.response.data.msg);
                });
        }
    };

    return (
        <>
            <TopBar />
            <Container>
                <h1>{t("Reset Password")}</h1>
                {isValidToken && (
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Stack spacing={2}>
                            <TextField
                                {...register("password")}
                                type="password"
                                label={t("Password")}
                                error={passwordError !== ""}
                                helperText={passwordError}
                                required
                            ></TextField>
                            <TextField
                                {...register("confirmPassword")}
                                type="password"
                                label={t("Confirm Password")}
                                error={confirmPasswordError !== ""}
                                helperText={confirmPasswordError}
                                required
                            ></TextField>
                            <Button type="submit" variant="contained">
                                {t("Submit")}
                            </Button>
                        </Stack>
                    </form>
                )}
                {!isValidToken && <p>{t("Failed to attempt to reset your password. Please use correct link from your inbox")}</p>}
            </Container>
        </>
    );
};

export default ResetPasswordPage;
