"use client";
import React from "react";
import useStore from "../stores";

const Unauthorized = () => {
    const setAuth = useStore((state) => state.setAuth);
    setAuth(false);
    return (
        <div className="flex flex-col justify-center items-center my-52 h-full text-center">
            <h1 className="min-w-max text-2xl font-bold sm:text-3xl">
                Unauthorized, login token expired please login again
            </h1>
        </div>
    );
};

export default Unauthorized;
