"use client";
import React, { useState } from "react";
import DarkModeToggle from "../src/components/DarkModeToggle";
import { CssVarsProvider, extendTheme, styled } from "@mui/joy/styles";
import Box from "@mui/joy/Box";
import IconButton from "@mui/joy/IconButton";
import Menu from "@mui/joy/Menu";
import MenuItem from "@mui/joy/MenuItem";
import Container from "@mui/joy/Container";
import { getInitColorSchemeScript } from "@mui/joy/styles";
import { AppBar, Toolbar } from "@mui/material";
import { AiOutlineMenu } from "react-icons/ai";
import { Dropdown, MenuButton } from "@mui/joy";
import PageLink from "../src/components/PageLink";

const theme = extendTheme({
    colorSchemes: {
        light: {
            palette: {
                background: {
                    body: "#fff",
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
        JoyButton: {
            defaultProps: {
                variant: "solid",
                color: "primary",
                style: {
                    color: "#171D22",
                },
            },
        },
    },
});

const Header = () => {
    const [anchorElNav, setAnchorElNav] = useState<HTMLElement | null>(null);

    const handleOpenNavMenu = (e: React.MouseEvent) => {
        setAnchorElNav(e.currentTarget as HTMLElement);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const headerItems = [
        { name: "Sign In", href: "/signin" },
        { name: "Login", href: "/login" },
    ];

    return (
        <div className="p-5 flex w-full leading=[1.8em] justify-between flex-row items-center shrink-0">
            <h1 className="font-bold sm:text-2xl md:text-3xl">INVEBB</h1>
            <Box
                sx={{
                    flexGrow: 0,
                    display: { xs: "flex", md: "none" },
                }}
            >
                <DarkModeToggle />
                <Dropdown>
                    <MenuButton
                        slots={{ root: IconButton }}
                        slotProps={{
                            root: { variant: "outlined", color: "neutral" },
                        }}
                        onClick={
                            Boolean(anchorElNav)
                                ? handleCloseNavMenu
                                : handleOpenNavMenu
                        }
                        color="neutral"
                        size="md"
                    >
                        <AiOutlineMenu />
                    </MenuButton>
                    <Menu
                        open={Boolean(anchorElNav)}
                        onClose={handleCloseNavMenu}
                        sx={{
                            display: { xs: "block", md: "none" },
                        }}
                        id="menu-header"
                        keepMounted
                        anchorEl={anchorElNav}
                    >
                        {headerItems.map((item, key) => (
                            <MenuItem key={key} onClick={handleCloseNavMenu}>
                                <PageLink href={item.href} passHref>
                                    {item.name}
                                </PageLink>
                            </MenuItem>
                        ))}
                    </Menu>
                </Dropdown>
            </Box>

            <Box sx={{ display: { xs: "none", md: "flex" } }}>
                {headerItems.map((item, key) => (
                    <PageLink key={key} className="mr-5" href={item.href}>
                        {item.name}
                    </PageLink>
                ))}
                <DarkModeToggle />
            </Box>
        </div>
    );
};

interface ThemeProps {
    children: React.ReactNode;
}

const Background = styled("div")(({ theme }) => {
    return {
        background: theme.vars.palette.background.body,
        color: theme.vars.palette.text.primary,
    };
});

const Theme = ({ children }: ThemeProps) => {
    return (
        <>
            <CssVarsProvider
                modeStorageKey="dark-mode-toggle"
                colorSchemeSelector="#container"
                defaultMode="dark"
                theme={theme}
                disableNestedContext
            >
                <Background
                    id="container"
                    className="flex flex-col items-center w-full h-full"
                >
                    <Header />
                    <div className="container flex flex-col mx-10">
                        {children}
                    </div>
                </Background>
            </CssVarsProvider>
        </>
    );
};

export default Theme;
