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
        return <Button variant="outlined" sx={{ width: 90 }}></Button>;
    }

    return (
        <Button
            variant="outlined"
            onClick={() => setMode(mode === "dark" ? "light" : "dark")}
        >
            {mode === "dark" ? "Turn light" : "Turn dark"}
        </Button>
    );
};

export default DarkModeToggle;
