"use client";
import { Button, FormControl, FormLabel, Input } from "@mui/joy";
import React, { useState, useEffect, useReducer } from "react";
import FormWrapper from "../FormWrapper";
import { InputChangeHandler, NewUser, ValidationResponse } from "../types";
import useStore from "../stores";
import { useRouter } from "next/navigation";
import axios from "axios";
import { API_BASE, API_LOG_IN, API_SIGN_UP } from "../constants";
import { writeToLocalStore } from "../utils";

const InputWrapper = ({
    label,
    placeholder,
    type = "text",
    value,
    onChange,
}: {
    label: string;
    placeholder: string;
    type?: string;
    value: string | number;
    onChange: InputChangeHandler;
}) => (
    <FormControl>
        <FormLabel className="text-xl font-medium">{label}</FormLabel>
        <Input
            value={value}
            onChange={onChange}
            className="min-w-[50%] p-3 min-h-[2.5rem]"
            type={type}
            placeholder={placeholder}
        />
    </FormControl>
);

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
            value={email}
            onChange={onEmailChange}
            label="Email"
            placeholder="Enter your email address"
        />
        <InputWrapper
            value={password}
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

    const updateEmail = useStore((state) => state.updateEmail);
    const updateId = useStore((state) => state.updateId);
    const clearEmail = useStore((state) => state.clearEmail);
    const clearId = useStore((state) => state.clearId);
    const setAuth = useStore((state) => state.setAuth);

    const userEmail = useStore((state) => state.user.email);
    const userId = useStore((state) => state.user.id);
    const isUserAuthed = useStore((state) => state.user.isAuthed);

    const [password, updatePassword] = useState<string>("");
    const [rememberMe, updateRemeberState] = useState<boolean>(false);
    const [pwdHidden, updatePwdState] = useReducer((hidden) => !hidden, false);
    const [errors, updateErrors] = useState<ValidationResponse[]>([]);

    const onSubmitDetails = (e: React.FormEvent, type: "login" | "signup") => {
        e.preventDefault();
        const user: NewUser = {
            email: userEmail,
            password: password,
        };

        if (type === "login") {
            axios
                .post(`${API_BASE}${API_LOG_IN}`, user)
                .then((res) => {
                    if (res.status == 200) {
                        clearEmail();
                        clearId();
                        updatePassword("");
                        updateErrors([]);

                        writeToLocalStore("token", res.data.accessToken);
                        writeToLocalStore(
                            "refreshToken",
                            res.data.refreshToken,
                        );
                        setAuth(true);
                        updateEmail(res.data.email);
                        updateId(res.data.id);
                        router.push(`/home/${res.data.id}`);
                    }
                })
                .catch((err) => {
                    setAuth(true);
                    const msg = err.response.data.msg;
                    console.log({ msg });
                    if (Array.isArray(msg)) {
                        updateErrors(msg);
                    } else {
                        console.log({ err });
                    }
                });
        } else {
            axios
                .post(`${API_BASE}${API_SIGN_UP}`, user)
                .then((res) => {
                    if (res.status == 200) {
                        router.push("/login");
                    }
                })
                .catch((err) => {
                    const msg = err.response.data.msg;
                    console.log({ msg });
                    if (Array.isArray(msg)) {
                        updateErrors(msg);
                    } else {
                        console.log({ err });
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
                <Button variant="solid" className="text-xl" type="submit">
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
                <Button variant="solid" className="text-xl" type="submit">
                    Sign Up
                </Button>
                <ValidationFeedback errors={errors} />
            </FormWrapper>
        );
    }
};

export default DetailsPage;
