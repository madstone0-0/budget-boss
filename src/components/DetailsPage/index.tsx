"use client";
import {
    Button,
    FormControl,
    FormLabel,
    IconButton,
    Input,
    Typography,
} from "@mui/joy";
import React, { useState, useEffect, useReducer } from "react";
import FormWrapper from "../FormWrapper";
import { InputChangeHandler, NewUser, ValidationResponse } from "../types";
import useStore from "../stores";
import { useRouter, redirect } from "next/navigation";
import axios from "axios";
import { API_BASE, API_LOG_IN, API_SIGN_UP } from "../constants";
import { writeToLocalStore } from "../utils";
import { cookies } from "next/headers";
import { useSnackbar } from "notistack";
import { EyeOffIcon, EyeIcon } from "lucide-react";
import { createJWTCookie } from "../../../app/actions";
import InputWrapper from "../InputWrapper";
import Fetch from "../utils/Fetch";

const Shared = ({
    onPasswordChange,
    onEmailChange,
    password,
    email,
}: {
    onPasswordChange: InputChangeHandler;
    onEmailChange: InputChangeHandler;
    password: string;
    email: string;
}) => (
    <>
        <InputWrapper
            value$={email}
            onChange={onEmailChange}
            muiOptions={{ required: true }}
            label="Email"
            placeholder="Enter your email address"
        />
        <InputWrapper
            muiOptions={{
                required: true,
            }}
            value$={password}
            onChange={onPasswordChange}
            label="Password"
            placeholder="Enter your password"
            type="password"
        />
    </>
);

const ValidationFeedback = ({ errors }: { errors: ValidationResponse[] }) => {
    if (!errors) {
        return <></>;
    }
    return (
        <div className="p-5 w-fit min-h-fit">
            <ul>
                {errors.map((error) => (
                    <li>{error.msg}</li>
                ))}
            </ul>
        </div>
    );
};

const DetailsPage = ({ login = false }: { login?: boolean }) => {
    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();

    const updateEmail = useStore((state) => state.updateEmail);
    const updateId = useStore((state) => state.updateId);
    const clearEmail = useStore((state) => state.clearEmail);
    const clearId = useStore((state) => state.clearId);
    const setAuth = useStore((state) => state.setAuth);
    const setHasCreatedBudget = useStore((state) => state.setHasCreatedBudget);

    const userEmail = useStore((state) => state.user.email);
    const userId = useStore((state) => state.user.id);
    const isUserAuthed = useStore((state) => state.user.isAuthed);

    const [password, updatePassword] = useState<string>("");
    const [rememberMe, updateRemeberState] = useState<boolean>(false);
    const [errors, updateErrors] = useState<ValidationResponse[]>([]);

    const detailFetch = new Fetch();

    const onSubmitDetails = (e: React.FormEvent, type: "login" | "signup") => {
        e.preventDefault();
        const user: NewUser = {
            email: userEmail,
            password: password,
        };

        if (type === "login") {
            detailFetch
                .post(API_LOG_IN, user)
                .then((res) => {
                    if (res.status == 200) {
                        updatePassword("");
                        clearEmail();
                        clearId();
                        const {
                            email,
                            id,
                            refreshToken,
                            accessToken,
                            hasCreatedBudget,
                        } = res.data.userDetails;
                        updateErrors([]);

                        createJWTCookie("token", accessToken);
                        createJWTCookie("refreshToken", refreshToken);
                        setAuth(true);
                        setHasCreatedBudget(hasCreatedBudget);
                        updateEmail(email);
                        updateId(id);
                        enqueueSnackbar("Successfully logged in", {
                            variant: "success",
                        });
                        router.push(`/home/${id}`);
                    }
                })
                .catch((err) => {
                    setAuth(false);
                    const msg = err.response.data.msg;
                    console.log({ msg });
                    if (Array.isArray(msg)) {
                        updateErrors(msg);
                    } else {
                        let shownMsg = msg;
                        switch (err.response.status) {
                            case 401:
                                shownMsg = "Invalid email or password";
                                break;
                            case 500:
                                shownMsg = "Something went wrong";
                                break;
                            default:
                                shownMsg = msg;
                                break;
                        }
                        enqueueSnackbar(`${shownMsg}`, { variant: "error" });
                    }
                });
        } else {
            detailFetch
                .post(API_SIGN_UP, user)
                .then((res) => {
                    enqueueSnackbar("Successfully signed up", {
                        variant: "success",
                    });

                    if (res.status == 200) {
                        router.replace("/login");
                    }
                })
                .catch((err) => {
                    const msg = err.response.data.msg;
                    if (Array.isArray(msg)) {
                        updateErrors(msg);
                    } else {
                        enqueueSnackbar(`${msg}`, { variant: "error" });
                    }
                });
        }
    };

    const onEmailChange: InputChangeHandler = (e) => {
        updateEmail(e.currentTarget.value);
    };

    const onPasswordChange: InputChangeHandler = (e) => {
        updatePassword(e.currentTarget.value);
    };

    if (login) {
        return (
            <FormWrapper
                className="my-20"
                onSubmit={(e) => onSubmitDetails(e, "login")}
            >
                <Shared
                    password={password}
                    email={userEmail}
                    onPasswordChange={onPasswordChange}
                    onEmailChange={onEmailChange}
                />
                <a href="#">Forgot Password</a>
                <Button
                    variant="solid"
                    sx={(theme) => ({ color: theme.palette.text.primary })}
                    className="text-xl"
                    type="submit"
                >
                    Login
                </Button>
                <ValidationFeedback errors={errors} />
            </FormWrapper>
        );
    } else {
        return (
            <FormWrapper
                className="my-20"
                onSubmit={(e) => onSubmitDetails(e, "signup")}
            >
                <Shared
                    password={password}
                    email={userEmail}
                    onPasswordChange={onPasswordChange}
                    onEmailChange={onEmailChange}
                />
                <Button
                    sx={(theme) => ({ color: theme.palette.text.primary })}
                    variant="solid"
                    className="text-xl"
                    type="submit"
                >
                    Sign Up
                </Button>
                <ValidationFeedback errors={errors} />
            </FormWrapper>
        );
    }
};

export default DetailsPage;
