"use client";
import { Button, FormControl, FormLabel, Input } from "@mui/joy";
import React, { useState, useEffect, useReducer } from "react";
import FormWrapper from "../FormWrapper";

const InputWrapper = ({
    label,
    placeholder,
    type = "text",
    onChange,
}: {
    label: string;
    placeholder: string;
    type?: string;
    onChange: React.ChangeEventHandler;
}) => (
    <FormControl>
        <FormLabel className="text-xl font-medium">{label}</FormLabel>
        <Input
            onChange={onChange}
            className="min-w-[50%] min-h-[2.5rem]"
            type={type}
            placeholder={placeholder}
        />
    </FormControl>
);

const DetailsPage = ({ login = false }: { login?: boolean }) => {
    const [email, updateEmail] = useState<string>("");
    const [password, updatePassword] = useState<string>("");
    const [rememberMe, updateRemeberState] = useState<boolean>(false);
    const [pwdHidden, updatePwdState] = useReducer((hidden) => !hidden, false);

    const placeholder = (e: React.FormEvent, name: string) => {
        e.preventDefault();
        console.log({ name });
    };

    const onEmailChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        updateEmail(e.currentTarget.value);
    };

    const onPasswordChange: React.ChangeEventHandler<HTMLInputElement> = (
        e,
    ) => {
        updatePassword(e.currentTarget.value);
    };

    if (login) {
        return (
            <FormWrapper
                className="my-28"
                onSubmit={(e) => placeholder(e, "Login")}
            >
                <InputWrapper
                    onChange={onEmailChange}
                    label="Email"
                    placeholder="abc@gmail.com"
                />
                <InputWrapper
                    onChange={onPasswordChange}
                    label="Password"
                    placeholder="Password"
                    type="password"
                />
                <Button variant="solid" className="text-xl" type="submit">
                    Login
                </Button>
            </FormWrapper>
        );
    } else {
        return (
            <FormWrapper
                className="my-28"
                onSubmit={(e) => placeholder(e, "Sign Up")}
            >
                <InputWrapper
                    onChange={onEmailChange}
                    label="Email"
                    placeholder="abc@gmail.com"
                />
                <InputWrapper
                    onChange={onPasswordChange}
                    label="Password"
                    placeholder="Password"
                    type="password"
                />
                <Button variant="solid" className="text-xl" type="submit">
                    Sign Up
                </Button>
            </FormWrapper>
        );
    }
};

export default DetailsPage;
