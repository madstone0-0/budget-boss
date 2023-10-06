"use client";
import { Box } from "@mui/joy";
import React from "react";
import PageLink from "../PageLink";

const OnBoarding = ({ id }: { id: string }) => {
    return (
        <div className="flex flex-col justify-center items-center my-52 h-full text-center">
            <h1 className="min-w-max text-2xl font-bold sm:text-3xl">
                Not Implemented
            </h1>
            <p className="text-sm text-gray-500">
                This feature is not implemented yet. Please click the link below
                to skip the onboarding process.
            </p>
            <PageLink href={`/home/${id}/budget/home`}>Skip</PageLink>
        </div>
    );
};

export default OnBoarding;
