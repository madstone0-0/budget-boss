"use client";
import React from "react";
import {
    CssVarsProvider,
    extendTheme,
    styled,
    getInitColorSchemeScript,
} from "@mui/joy/styles";
import { CssBaseline } from "@mui/joy";

const theme = extendTheme({
    colorSchemes: {
        light: {
            palette: {
                background: {
                    body: "#ffffff",
                },
                primary: {
                    "600": "#5ED5A8",
                },
            },
        },
        dark: {
            palette: {
                background: {
                    body: "#1b232a",
                },
                text: {
                    primary: "#fff",
                },
                primary: {
                    "600": "#5ED5A8",
                },
            },
        },
    },
    components: {
        JoyMenuItem: {
            defaultProps: {
                variant: "solid",
                color: "neutral",
            },
        },
        JoyLink: {
            defaultProps: {
                underline: "none",
            },
            styleOverrides: {
                root: ({ theme }) => ({
                    color: theme.vars.palette.primary[600],
                }),
            },
        },
    },
});

interface ThemeProps {
    children: React.ReactNode;
}

const Background = styled("div")(({ theme }) => {
    return {
        height: "100%",
        background: theme.vars.palette.background.body,
        color: theme.vars.palette.text.primary,
    };
});

const Theme = ({ children }: ThemeProps) => {
    return (
        <>
            <CssBaseline />
            <CssVarsProvider
                // modeStorageKey="dark-mode-toggle"
                colorSchemeSelector="#container"
                defaultMode="dark"
                theme={theme}
                disableNestedContext
            >
                <Background id="container">
                    <div className="container flex flex-col mx-10">
                        {children}
                    </div>
                </Background>
            </CssVarsProvider>
        </>
    );
};

export default Theme;
