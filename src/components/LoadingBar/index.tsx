import React from "react";
import CircularProgress from "@mui/joy/CircularProgress";

const LoadingBar = () => (
    <div className="flex flex-col justify-center items-center w-full h-full align-middle my-50">
        <CircularProgress
            size="lg"
            sx={{
                // width: {
                //     xs: "30px",
                //     md: "100px",
                // },
                // height: {
                //     xs: "30px",
                //     md: "100px",
                // },
                alignSelf: "center",
            }}
        />
    </div>
);

export default LoadingBar;
