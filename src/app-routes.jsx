import React from "react";
import { Route, Routes } from "react-router-dom";
import ErrorPage from "./pages/errorPage";
import SignUpPage from "./pages/auth/signUpPage";
import UserDetailsPage from "./pages/user-details";
import LoginPage from "./pages/auth/loginPage";
import LogoutPage from "./pages/auth/logoutPage";
import useToken from "./hooks/useToken";
import ForgotPasswordPage from "./pages/auth/forgotPasswordPage";
import ResetPasswordPage from "./pages/auth/resetPasswordPage";

const AppRoutes = () => {
    // eslint-disable-next-line no-unused-vars
    const { token, setToken } = useToken();

    return (
        <Routes>
            <Route path="*" element={<ErrorPage />} />
            <Route exact path="/" element={<LoginPage />} />
            <Route path="/auth/signup" element={<SignUpPage />} />
            <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
            <Route path="/user-details" element={<UserDetailsPage />} />
            {token && <Route path="/auth/logout" element={<LogoutPage />} />}
        </Routes>
    );
};

export default AppRoutes;
