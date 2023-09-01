import React, { useState, useLayoutEffect } from "react";
import { Props } from "./types.ts";
import { PageContextProvider } from "./hooks";
import { CssVarsProvider, extendTheme } from "@mui/joy/styles";
import Link from "@mui/joy/Link";
import "./PageShell.css";
import styled from "@emotion/styled";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import DarkModeToggle from "../components/DarkModeToggle";
import useEnhancedEffect from "@mui/material/utils/useEnhancedEffect";

export { PageShell };

const theme = extendTheme({
    colorSchemes: {
        light: {
            palette: {
                background: {
                    body: "#fff",
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
            },
        },
    },
});

const Header = () => {
    return (
        <div className="p-5 flex w-full leading=[1.8em] justify-between flex-row  items-center shrink-0">
            <h1 className="text-3xl font-bold">INVEBB</h1>
            <div className="flex flex-row">
                <Link className="mr-5" href="/signin">
                    Sign In
                </Link>
                <Link className="mr-5" href="/login">
                    Log In
                </Link>
                <DarkModeToggle />
            </div>
        </div>
    );
};

const Background = styled("div")(({ theme }) => {
    return {
        background: theme.vars.palette.background.body,
        color: theme.vars.palette.text.primary,
    };
});

const PageShell = ({ children, pageContext }: Props) => {
    const [node, setNode] = useState<HTMLElement | null>(null);
    useEnhancedEffect(() => {
        setNode(document.getElementById("container"));
    }, []);

    return (
        <React.StrictMode>
            <PageContextProvider pageContext={pageContext}>
                <CssVarsProvider
                    modeStorageKey="dark-mode-toggle"
                    colorSchemeNode={node || null}
                    colorSchemeSelector="#container"
                    defaultMode="system"
                    theme={theme}
                    disableNestedContext
                >
                    <Box
                        id="container"
                        className="flex flex-col items-center w-full h-full"
                    >
                        <Header />
                        <div className="container flex flex-col mx-10">
                            {children}
                        </div>
                    </Box>
                </CssVarsProvider>
            </PageContextProvider>
        </React.StrictMode>
    );
};
