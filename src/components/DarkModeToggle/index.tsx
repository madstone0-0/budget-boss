import React, { useEffect, useState } from "react";
import Button from "@mui/joy/Button";
import { useColorScheme } from "@mui/joy/styles";

const DarkModeToggle = () => {
    const { mode, setMode } = useColorScheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);
    if (!mounted) {
        return (
            <Button
                variant="outlined"
                color="neutral"
                sx={{ width: 120 }}
            ></Button>
        );
    }

    console.log({ mode });
    return (
        <Button
            variant="outlined"
            color="neutral"
            onClick={() => setMode(mode === "dark" ? "light" : "dark")}
        >
            {mode === "dark" ? "Light" : "Dark"}
        </Button>
    );
};

export default DarkModeToggle;
