import { useState } from "react";

const useToken = () => {
    const getToken = () => {
        const userToken = localStorage.getItem("token");
        return userToken === "undefined" || userToken === "null" ? undefined : userToken;
    };

    const [token, setToken] = useState(getToken());

    const saveToken = (userToken) => {
        localStorage.setItem("token", userToken);
        setToken(userToken);
    };

    return {
        setToken: saveToken,
        token,
    };
};

export default useToken;
