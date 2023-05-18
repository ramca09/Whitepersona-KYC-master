import { Button, Container, Link, Stack, TextField } from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import TopBar from "../../components/TopBar";
import useToken from "../../hooks/useToken";
import { useTranslation } from "react-i18next";

const LoginPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const { register, handleSubmit } = useForm();
    // eslint-disable-next-line no-unused-vars
    const { token, setToken } = useToken();

    const onSubmit = (data) => {
        axios
            .post(`${process.env.REACT_APP_SERVER_URI}/auth/login`, data)
            .then((response) => {
                if (response.data.msg === "success" && response.data.token) {
                    setToken(response.data.token);
                    navigate("/user-details");
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
                <h1>{t("Login")}</h1>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Stack spacing={2}>
                        <TextField {...register("email")} label={t("Email")} required></TextField>
                        <TextField {...register("password")} type={t("password")} label="Password" required></TextField>
                        <Button type="submit" variant="contained">
                            {t("Login")}
                        </Button>
                        <Link href="/auth/forgot-password">{t("Forgot password?")}</Link>
                        <Link href="/auth/signup">{t("Signup")}</Link>
                    </Stack>
                </form>
            </Container>
        </>
    );
};

export default LoginPage;
