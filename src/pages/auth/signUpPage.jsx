import { Button, Container, Stack, TextField } from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import TopBar from "../../components/TopBar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const UPPERCASE_REGEX = /(?=.*?[A-Z])/;
const LOWERCASE_REGEX = /(?=.*?[a-z])/;
const DIGITS_REGEX = /(?=.*?[0-9])/;
const SPECIAL_CHAR_REGEX = /(?=.*?[#?!@$%^&*-])/;
const MINIMUM_LENGTH_REGEX = /.{8,}/;

const SignUpPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [passwordError, setPasswordError] = React.useState("");
    const [confirmPasswordError, setConfirmPasswordError] = React.useState("");
    const { register, handleSubmit } = useForm();

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
                .post(`${process.env.REACT_APP_SERVER_URI}/auth/signup`, data)
                .then((response) => {
                    if (response.data.msg === "User registered")
                        axios
                            .post(
                                `${process.env.REACT_APP_SERVER_URI}/email/send`,
                                {},
                                {
                                    params: {
                                        email: data.email,
                                    },
                                }
                            )
                            .then((response) => {
                                if (response.data.msg === "Email sent") navigate("/");
                                else console.error(response.data.msg);
                            })
                            .catch((error) => {
                                if (!error.response) alert("Backend server not running!");
                                else alert(error.response.data.msg);
                            });
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
                <h1>{t("Signup with us")}</h1>
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
                        <TextField {...register("email")} type="email" label={t("Email")} required></TextField>
                        <TextField {...register("firstName")} label={t("First Name")} required></TextField>
                        <TextField {...register("lastName")} label={t("Last Name")} required></TextField>
                        <TextField {...register("referredBy")} label={t("Referred By (username)")}></TextField>
                        <Button type="submit" variant="contained">
                            {t("Submit")}
                        </Button>
                    </Stack>
                </form>
            </Container>
        </>
    );
};

export default SignUpPage;
