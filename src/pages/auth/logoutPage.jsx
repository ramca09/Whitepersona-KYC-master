import React from "react";
import { Navigate } from "react-router-dom";

import useToken from "../../hooks/useToken";

const LogoutPage = () => {
    const { token, setToken } = useToken();

    if (token) setToken(null);

    return <Navigate to="/" />;
};

export default LogoutPage;
