import { Autocomplete, Button, Container, FormControlLabel, FormGroup, Stack, Switch, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Persona from "persona";

import TopBar from "../../components/TopBar";
import useToken from "../../hooks/useToken";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { useTranslation } from "react-i18next";

const UserDetailsPage = () => {
    const [user, setUser] = useState();
    const [countries, setCountries] = useState();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { token, setToken } = useToken();
    if (!token) return <Navigate to="/" />;

    useEffect(() => {
        axios
            .get(`${process.env.REACT_APP_SERVER_URI}/user/me`, { headers: { Authorization: `Bearer ${token}` } })
            .then((response) => {
                setUser(response.data.user);
            })
            .catch((error) => {
                if (!error.response) alert("Backend server not running!");
                if (error.response.data.msg === "Invalid Token!") {
                    setToken(null);
                    navigate("/");
                } else alert(error.response.data.msg);
            });

        axios
            .get(`${process.env.REACT_APP_SERVER_URI}/user/country/all`, { headers: { Authorization: `Bearer ${token}` } })
            .then((response) => {
                setCountries(response.data.countries);
            })
            .catch((error) => {
                if (!error.response) alert("Backend server not running!");
                else alert(error.response.data.msg);
            });
    }, []);

    const { register, handleSubmit } = useForm();

    const onSubmit = (data) => {
        data.id = user.id;
        data.countryOfResidence =
            data.countryOfResidence === "" ? user.country_of_residence : countries.filter((t) => t.country_name === data.countryOfResidence)[0].country_code;
        data.nationality = data.nationality === "" ? user.nationality : countries.filter((t) => t.country_name === data.nationality)[0].country_code;
        data.service = data.service === "" ? data.service : services.filter((t) => t.name === data.service)[0].code;
        axios
            .put(`${process.env.REACT_APP_SERVER_URI}/user`, { data }, { headers: { Authorization: `Bearer ${token}` } })
            .then((response) => {
                if (response.data.msg === "Kyc Form Saved") {
                    if (user.status === 1) {
                        const fields = {
                            // nameFirst: data.firstName,
                            // nameLast: data.lastName,
                            // birthdate: data.dateOfBirth,
                            // addressStreet1: data.address,
                            // addressCity: data.city,
                            // addressSubdivision: data.stateOrProvince,
                            // addressPostalCode: data.postalCode,
                            // addressCountryCode: data.countryOfResidence,
                            // phoneNumber: data.mobilePhone,
                            // emailAddress: data.email,
                            // customAttribute: "hello",
                        };

                        const client = new Persona.Client({
                            templateId: process.env.REACT_APP_KYC_TEMPLATE_ID,
                            environmentId: process.env.REACT_APP_KYC_ENVIRONMENT_ID,
                            fields,
                            onReady: () => client.open(),
                            onComplete: ({ inquiryId, status, fields }) => {
                                axios
                                    .put(
                                        `${process.env.REACT_APP_SERVER_URI}/user/inquiry/${user.id}`,
                                        { inquiryId },
                                        { headers: { Authorization: `Bearer ${token}` } }
                                    )
                                    .then((response) => {
                                        if (response.data.msg === "Inquiry Updated")
                                            axios.post(`${process.env.REACT_APP_SERVER_URI}/kyc-success/${user.id}`).catch((error) => {
                                                if (!error.response) alert("Backend server not running!");
                                                else alert(error.response.data.msg);
                                            });
                                    });
                            },
                            onEvent: (name, meta) => {
                                switch (name) {
                                    case "start":
                                        console.log(`Received event: start`);
                                        break;
                                    default:
                                        console.log(`Received event: ${name} with meta: ${JSON.stringify(meta)}`);
                                }
                            },
                            // onCancel: ({ inquiryId, sessionToken }) => console.log("OnCancel"),
                            onError: (error) => console.log(error),
                        });
                    } else alert("Saved!");
                }
            })
            .catch((error) => {
                if (!error.response) alert("Backend server not running!");
                else alert(error.response.data.msg);
            });
    };

    return (
        <>
            {user && (
                <>
                    <TopBar isLoggedIn={true} />
                    <Container>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Stack spacing={2}>
                                <TextField {...register("firstName")} label={t("First Name")} defaultValue={user.first_name} required />
                                <TextField {...register("middleName")} label={t("Middle Name")} defaultValue={user.middle_name} />
                                <TextField {...register("lastName")} label={t("Last Name")} defaultValue={user.last_name} required />
                                <TextField {...register("companyName")} label={t("Company Name")} defaultValue={user.company_name} />
                                <TextField {...register("jobTitle")} label={t("Job Title")} defaultValue={user.job_title} />
                                <TextField type="email" {...register("email")} label={t("Email")} defaultValue={user.email} required />
                                <TextField {...register("telephone")} label={t("Telephone")} defaultValue={user.telephone} />
                                <TextField {...register("mobilePhone")} label={t("Mobile Phone")} defaultValue={user.mobile_phone} required />
                                {countries && (
                                    <Autocomplete
                                        options={countries}
                                        autoHighlight
                                        disableClearable
                                        getOptionLabel={(option) => option.country_name}
                                        renderInput={(params) => (
                                            <TextField {...params} label={t("Country Of Residence")} {...register("countryOfResidence")} required />
                                        )}
                                        defaultValue={countries.filter((t) => t.country_code === user.country_of_residence)[0]}
                                    />
                                )}
                                <TextField {...register("stateOrProvince")} label={t("State/Province")} defaultValue={user.state_or_province} required />
                                <TextField {...register("buildingNumber")} label={t("Building Number")} defaultValue={user.building_number} />
                                <TextField {...register("city")} label={t("City")} defaultValue={user.city} required />
                                <TextField {...register("postalCode")} label={t("Postal Code")} defaultValue={user.postal_code} required />
                                <TextField {...register("address")} label={t("Address")} defaultValue={user.address} required />
                                <TextField {...register("dateOfBirth")} label={t("Date Of Birth")} defaultValue={user.date_of_birth} required />
                                {countries && (
                                    <Autocomplete
                                        options={countries}
                                        autoHighlight
                                        disableClearable
                                        getOptionLabel={(option) => option.country_name}
                                        renderInput={(params) => <TextField {...params} label={t("Nationality")} {...register("nationality")} required />}
                                        defaultValue={countries.filter((t) => t.country_code === user.nationality)[0]}
                                    />
                                )}
                                <TextField {...register("cityOfBirth")} label={t("City Of Birth")} defaultValue={user.city_of_birth} />
                                <TextField {...register("gender")} label={t("Gender")} defaultValue={user.gender} required />
                                <FormGroup>
                                    <FormControlLabel
                                        control={<Switch {...register("isUSPerson")} />}
                                        defaultValue={user.is_us}
                                        label={t("Are you a US person?")}
                                    />
                                </FormGroup>
                                <Autocomplete
                                    options={services}
                                    autoHighlight
                                    disableClearable
                                    getOptionLabel={(option) => option.name}
                                    renderInput={(params) => <TextField {...params} label={t("Service")} {...register("service")} required />}
                                    defaultValue={services.filter((t) => t.code === user.service)[0]}
                                />
                                <TextField {...register("referredBy")} defaultValue={user.referred_by} label={t("Referred By (username)")} />
                                <TextField {...register("wkycLevel")} label={t("WKYC Level")} defaultValue={user.status} disabled />
                                <Button type="submit" variant="contained">
                                    {t("Submit")}
                                </Button>
                            </Stack>
                        </form>
                    </Container>
                </>
            )}
        </>
    );
};

const services = [
    { code: "BANK", name: "Bank Account" },
    { code: "CARD", name: "Card" },
    { code: "COIN", name: "Crypto" },
    { code: "GOLD", name: "Gold" },
    { code: "VISA", name: "Visa" },
    { code: "FUND", name: "Funding" },
    { code: "REAL", name: "Real Estate" },
];

// https://www.map-in-excel.com/tutorials/iso3-country-codes/

export default UserDetailsPage;
