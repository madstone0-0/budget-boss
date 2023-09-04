"use client";
import { Box, Stack } from "@mui/joy";
import React from "react";

const FormWrapper = ({
    children,
    onSubmit,
    className = "",
}: {
    children: React.ReactNode;
    onSubmit: React.FormEventHandler;
    className?: string;
}) => {
    return (
        <div
            className={
                "flex flex-col justify-center items-center self-center max-w-5xl min-w-[35vw] " +
                className
            }
        >
            <Box sx={{ maxWidth: "inherit", minWidth: "inherit" }}>
                <form onSubmit={onSubmit}>
                    <Stack spacing={5}>{children}</Stack>
                </form>
            </Box>
        </div>
    );
};

export default FormWrapper;
