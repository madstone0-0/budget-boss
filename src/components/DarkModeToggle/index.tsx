import React, { useEffect, useState } from "react";
import IconButton from "@mui/joy/IconButton";
import { useColorScheme } from "@mui/joy/styles";
import { MoonIcon, SunIcon } from "lucide-react";

const DarkModeToggle = () => {
    const { mode, setMode } = useColorScheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);
    if (!mounted) {
        return (
            <IconButton variant="outlined" sx={{ width: "2rem" }}></IconButton>
        );
    }
    const iconSize = 24;

    return (
        <IconButton
            sx={(theme) => ({
                color: theme.palette.primary[500],
                padding: "0.5rem",
                width: "2rem",
            })}
            variant="outlined"
            onClick={() => setMode(mode === "dark" ? "light" : "dark")}
        >
            {mode === "dark" ? (
                <SunIcon size={iconSize} />
            ) : (
                <MoonIcon size={iconSize} />
            )}
        </IconButton>
    );
};

export default DarkModeToggle;
