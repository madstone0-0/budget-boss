"use client";
import { Button } from "@mui/joy";
import React, { useState } from "react";
import FormWrapper from "../FormWrapper";
import {
    InputChangeHandler,
    NewUser,
    UserDetails,
    ValidationResponse,
} from "../types";
import useStore from "../stores";
import { useRouter } from "next/navigation";
import { API_LOG_IN, API_SIGN_UP } from "../constants";
import { useSnackbar } from "notistack";
import { createJWTCookie } from "../../../app/actions";
import InputWrapper from "../InputWrapper";
import Fetch from "../utils/Fetch";

const Shared = ({
    onPasswordChange,
    onEmailChange,
    password,
    email,
    isLoading = false,
}: {
    onPasswordChange: InputChangeHandler;
    onEmailChange: InputChangeHandler;
    password: string;
    email: string;
    isLoading?: boolean;
}) => (
    <>
        <InputWrapper
            value$={email}
            type="email"
            onChange={onEmailChange}
            muiOptions={{ required: true, disabled: isLoading }}
            label="Email"
            placeholder="Enter your email address"
        />
        <InputWrapper
            muiOptions={{
                required: true,
                disabled: isLoading,
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
                {errors.map((error, key) => (
                    <li key={key}>{error.msg}</li>
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
    const [formEmail, updateFormEmail] = useState<string>("");
    const [rememberMe, updateRemeberState] = useState<boolean>(false);
    const [errors, updateErrors] = useState<ValidationResponse[]>([]);
    const [loading, isLoading] = useState<boolean>(false);

    const detailFetch = new Fetch();

    const onSubmitDetails = (e: React.FormEvent, type: "login" | "signup") => {
        e.preventDefault();
        isLoading(true);
        const user: NewUser = {
            email: formEmail,
            password: password,
        };

        if (type === "login") {
            detailFetch
                .post<{ userDetails: UserDetails }>(API_LOG_IN, user)
                .then(async (res) => {
                    if (res.status == 200) {
                        const {
                            email,
                            id,
                            refreshToken,
                            accessToken,
                            hasCreatedBudget,
                        } = res.data.userDetails;
                        router.push(`/home/${id}`);

                        updateErrors([]);

                        await createJWTCookie("token", accessToken);
                        await createJWTCookie("refreshToken", refreshToken);
                        setAuth(true);
                        setHasCreatedBudget(hasCreatedBudget);
                        updateEmail(email);
                        updateId(id);
                        enqueueSnackbar("Successfully logged in", {
                            variant: "success",
                        });
                        isLoading(false);
                        updatePassword("");
                        updateFormEmail("");
                    }
                })
                .catch((err) => {
                    setAuth(false);
                    const msg =
                        err.response != undefined
                            ? err.response.data.msg
                            : err.message;
                    if (Array.isArray(msg)) {
                        updateErrors(msg);
                    } else {
                        let shownMsg = msg;
                        if (err.response != undefined) {
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
                        }
                        enqueueSnackbar(`Error: ${shownMsg}`, {
                            variant: "error",
                        });
                        isLoading(false);
                    }
                });
        } else {
            detailFetch
                .post(API_SIGN_UP, user)
                .then((res) => {
                    isLoading(false);
                    enqueueSnackbar("Successfully signed up", {
                        variant: "success",
                    });

                    if (res.status == 200) {
                        router.push("/login");
                    }
                })
                .catch((err) => {
                    isLoading(false);
                    const msg =
                        err.response != undefined
                            ? err.response.data.msg
                            : err.message;
                    if (Array.isArray(msg)) {
                        updateErrors(msg);
                    } else {
                        enqueueSnackbar(`Error: ${msg}`, { variant: "error" });
                    }
                });
        }
    };

    const onEmailChange: InputChangeHandler = (e) => {
        updateFormEmail(e.currentTarget.value);
    };

    const onPasswordChange: InputChangeHandler = (e) => {
        updatePassword(e.currentTarget.value);
    };

    return (
        <FormWrapper
            className="my-28 sm:my-20"
            onSubmit={(e) => onSubmitDetails(e, login ? "login" : "signup")}
        >
            <Shared
                password={password}
                email={formEmail}
                onPasswordChange={onPasswordChange}
                onEmailChange={onEmailChange}
                isLoading={loading}
            />
            {login ? <a href="#">Forgot Password</a> : <></>}
            <Button
                loading={loading}
                sx={(theme) => ({
                    color: theme.palette.text.primary,
                    fontSize: "1.25rem",
                    lineHeight: "1.75rem",
                })}
                type="submit"
            >
                {login ? "Login" : "Sign Up"}
            </Button>
            <ValidationFeedback errors={errors} />
        </FormWrapper>
    );
};

export default DetailsPage;
