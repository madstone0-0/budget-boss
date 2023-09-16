import { Box } from "@mui/joy";
import React from "react";

const ComingSoon = () => (
    <div className="flex flex-col justify-center items-center my-52 h-full text-center">
        <Box>
            <h1 className="min-w-max text-2xl font-bold sm:text-3xl">
                Coming Soon
            </h1>
            <p className="text-sm text-gray-500">
                This page is under construction.
            </p>
        </Box>
    </div>
);

export default ComingSoon;
