import { AppBar, Box, Button, MenuItem, Select, Toolbar, Typography } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const TopBar = (props) => {
    const { t, i18n } = useTranslation();

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" color="inherit">
                <Toolbar>
                    <Link to="/">
                        <img src="/images/logo.jpg" alt="wigofinance logo" />
                    </Link>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}></Typography>
                    {props.isLoggedIn && (
                        <Button href="/auth/logout" color="inherit">
                            {t("Logout")}
                        </Button>
                    )}
                    <Select value={i18n.language || "en"} onChange={(e) => i18n.changeLanguage(e.target.value)} variant="standard">
                        <MenuItem key="en" value="en">
                            {t("English")}
                        </MenuItem>
                        <MenuItem key="fr" value="fr">
                            {t("French")}
                        </MenuItem>
                        <MenuItem key="vn" value="vn">
                            {t("Vietnamese")}
                        </MenuItem>
                    </Select>
                </Toolbar>
            </AppBar>
        </Box>
    );
};

export default TopBar;
