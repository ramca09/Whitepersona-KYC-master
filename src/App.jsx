import React from "react";
import "./App.css";
import AppRoutes from "./app-routes";
import { BrowserRouter } from "react-router-dom";
import { useTranslation } from "react-i18next";

function App() {
    const { t } = useTranslation();
    document.title = t("Whitepersona Kyc Template");

    return (
        <div className="App">
            <BrowserRouter>
                <AppRoutes />
            </BrowserRouter>
        </div>
    );
}

export default App;
