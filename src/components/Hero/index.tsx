"use client";
import React from "react";
import { styled } from "@mui/joy/styles";

const HeroHeader = styled("h1")(({}) => {
    return {
        color: "#1B232A",
    };
});

const HeroPage = () => {
    return (
        <div className="flex flex-row justify-center w-full h-full">
            <div className="w-full p-5 h-[90vh] bg-[#8FE1D7] bg-gradient-to-tr from-current to-[#35DC9F]">
                <HeroHeader className="m-5 font-bold text-center sm:text-2xl md:text-5xl">
                    Change the Way You Invest
                </HeroHeader>
            </div>
        </div>
    );
};

export default HeroPage;
