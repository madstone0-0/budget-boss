"use client";
import React, { Suspense } from "react";
import LoadingBar from "../LoadingBar";
import {
    CssVarsProvider,
    extendTheme,
    styled,
    getInitColorSchemeScript,
} from "@mui/joy/styles";
import { CssBaseline } from "@mui/joy";
import { SnackbarProvider } from "notistack";
import { QueryClient, QueryClientProvider } from "react-query";

const theme = extendTheme({
    colorSchemes: {
        light: {
            palette: {
                background: {
                    body: "#fff",
                },
                primary: {
                    "50": "#ecfdf5",
                    "100": "#d1fae5",
                    "200": "#a7f3d0",
                    "300": "#6ee7b7",
                    "400": "#34d399",
                    "500": "#10b981",
                    "600": "#059669",
                    "700": "#047857",
                    "800": "#065f46",
                    "900": "#064e3b",
                },
                success: {
                    "50": "#f0f9ff",
                    "100": "#e0f2fe",
                    "200": "#bae6fd",
                    "300": "#7dd3fc",
                    "400": "#38bdf8",
                    "500": "#0ea5e9",
                    "600": "#0284c7",
                    "700": "#0369a1",
                    "800": "#075985",
                    "900": "#0c4a6e",
                },
                danger: {
                    "50": "#fff1f2",
                    "100": "#ffe4e6",
                    "200": "#fecdd3",
                    "300": "#fda4af",
                    "400": "#fb7185",
                    "500": "#f43f5e",
                    "600": "#e11d48",
                    "700": "#be123c",
                    "800": "#9f1239",
                    "900": "#881337",
                },
                warning: {
                    "50": "#fffbeb",
                    "100": "#fef3c7",
                    "200": "#fde68a",
                    "300": "#fcd34d",
                    "400": "#fbbf24",
                    "500": "#f59e0b",
                    "600": "#d97706",
                    "700": "#b45309",
                    "800": "#92400e",
                    "900": "#78350f",
                },
                neutral: {
                    "50": "#f8fafc",
                    "100": "#f1f5f9",
                    "200": "#e2e8f0",
                    "300": "#cbd5e1",
                    "400": "#94a3b8",
                    "500": "#64748b",
                    "600": "#475569",
                    "700": "#334155",
                    "800": "#1e293b",
                    "900": "#1b232a",
                },
            },
        },
        dark: {
            palette: {
                background: {
                    body: "#1b232a",
                },
                primary: {
                    "50": "#ecfdf5",
                    "100": "#d1fae5",
                    "200": "#a7f3d0",
                    "300": "#6ee7b7",
                    "400": "#34d399",
                    "500": "#10b981",
                    "600": "#059669",
                    "700": "#047857",
                    "800": "#065f46",
                    "900": "#064e3b",
                },
                neutral: {
                    "50": "#f9fafb",
                    "100": "#f3f4f6",
                    "200": "#e5e7eb",
                    "300": "#d1d5db",
                    "400": "#9ca3af",
                    "500": "#6b7280",
                    "600": "#4b5563",
                    "700": "#374151",
                    "800": "#1f2937",
                    "900": "#1b232a",
                },
                danger: {
                    "50": "#fff1f2",
                    "100": "#ffe4e6",
                    "200": "#fecdd3",
                    "300": "#fda4af",
                    "400": "#fb7185",
                    "500": "#f43f5e",
                    "600": "#e11d48",
                    "700": "#be123c",
                    "800": "#9f1239",
                    "900": "#881337",
                },
                success: {
                    "50": "#f0f9ff",
                    "100": "#e0f2fe",
                    "200": "#bae6fd",
                    "300": "#7dd3fc",
                    "400": "#38bdf8",
                    "500": "#0ea5e9",
                    "600": "#0284c7",
                    "700": "#0369a1",
                    "800": "#075985",
                    "900": "#0c4a6e",
                },
                warning: {
                    "50": "#fffbeb",
                    "100": "#fef3c7",
                    "200": "#fde68a",
                    "300": "#fcd34d",
                    "400": "#fbbf24",
                    "500": "#f59e0b",
                    "600": "#d97706",
                    "700": "#b45309",
                    "800": "#92400e",
                    "900": "#78350f",
                },
            },
        },
    },
    components: {
        JoyMenuItem: {
            defaultProps: {
                variant: "solid",
            },
        },
        JoyLink: {
            defaultProps: {
                underline: "none",
            },
        },
        JoyFormLabel: {
            styleOverrides: {
                root: ({ theme }) => ({
                    color: theme.palette.text.primary,
                }),
            },
        },
        JoyInput: {
            styleOverrides: {
                root: ({ theme }) => ({
                    background: theme.palette.background.body,
                    color: theme.palette.text.primary,
                }),
            },
            defaultProps: {
                sx: {
                    minHeight: "2.5rem",
                    borderRadius: "0.375rem",
                    "--Input-focusedInset": "var(--any, )",
                    "--Input-focusedThickness": "0.25rem",
                    "&::before": {
                        transition: "box-shadow .15s ease-in-out",
                    },
                },
            },
        },
        JoyButton: {
            styleOverrides: {
                root: ({ theme }) => ({
                    color: theme.palette.text.primary,
                    borderRadius: 10,
                    lineHeight: "1.75rem",
                    height: "1.5rem",
                }),
            },
        },
        JoyModalDialog: {
            styleOverrides: {
                root: ({ theme }) => ({
                    background: theme.palette.background.body,
                }),
            },
        },
        JoySelect: {
            styleOverrides: {
                root: ({}) => ({
                    borderRadius: 10,
                    height: "2rem",
                }),
            },
        },
    },
});

interface ThemeProps {
    children: React.ReactNode;
}

const Background = styled("div")(({}) => {
    return {
        height: "100%",
    };
});

const Theme = ({ children }: ThemeProps) => {
    const queryClient = new QueryClient();
    return (
        <>
            {getInitColorSchemeScript()}
            <CssBaseline />
            <QueryClientProvider client={queryClient}>
                <CssVarsProvider
                    modeStorageKey="dark-mode-toggle"
                    colorSchemeSelector="#container"
                    defaultMode="dark"
                    theme={theme}
                    disableNestedContext
                >
                    <SnackbarProvider maxSnack={4}>
                        <Background id="container">
                            <div className="flex flex-col mx-5 sm:mx-10">
                                {children}
                            </div>
                        </Background>
                    </SnackbarProvider>
                </CssVarsProvider>
            </QueryClientProvider>
        </>
    );
};

export default Theme;
