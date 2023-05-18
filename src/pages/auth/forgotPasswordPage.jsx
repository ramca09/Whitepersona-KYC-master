import { Button, Container, Link, Stack, TextField } from "@mui/material";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

import TopBar from "../../components/TopBar";
import { useTranslation } from "react-i18next";

const ForgotPasswordPage = () => {
    const { t } = useTranslation();

    const [isEmailSent, setIsEmailSent] = useState();
    const { register, handleSubmit } = useForm();

    const onSubmit = (data) => {
        axios
            .post(
                `${process.env.REACT_APP_SERVER_URI}/email/forgot`,
                {},
                {
                    params: {
                        email: data.email,
                    },
                }
            )
            .then((response) => {
                if (response.data.msg === "Email sent") {
                    setIsEmailSent(true);
                }
            })
            .catch((error) => {
                if (!error.response) alert("Backend server not running!");
                else alert(error.response.data.msg);
            });
    };

    return (
        <>
            <TopBar />
            <Container>
                <h1>{t("Forgot password?")}</h1>
                {!isEmailSent && (
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Stack spacing={2}>
                            <TextField {...register("email")} label={t("Email")} required></TextField>
                            <Button type="submit" variant="contained">
                                {t("Send Email")}
                            </Button>
                            <Link href="/auth/login">{t("Login")}</Link>
                        </Stack>
                    </form>
                )}
                {isEmailSent && <p>{t("The email sent to reset your password. Please check your inbox.")}</p>}
            </Container>
        </>
    );
};

export default ForgotPasswordPage;
