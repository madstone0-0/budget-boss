"use client";
import { Box, Button, Dropdown, IconButton, MenuButton } from "@mui/joy";

import React, { MouseEventHandler, useEffect, useState } from "react";
import DarkModeToggle from "../DarkModeToggle";
import { MenuIcon } from "lucide-react";
import Menu from "@mui/joy/Menu";
import MenuItem from "@mui/joy/MenuItem";
import PageLink from "../PageLink";
import useStore from "../stores/index.ts";
import { NextRouter, useRouter } from "next/router";
import { ButtonChangeHandler } from "../types.ts";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";
import { deleteJWTCookie } from "../../../app/actions.ts";

const Header = ({ router }: { router?: AppRouterInstance }) => {
    const [anchorElNav, setAnchorElNav] = useState<HTMLElement | null>(null);
    const [mounted, setMounted] = useState<boolean>(false);

    const userId = useStore((state) => state.user.id);
    const clearEmail = useStore((state) => state.clearEmail);
    const clearId = useStore((state) => state.clearId);
    const setAuth = useStore((state) => state.setAuth);
    const clearUserBudgets = useStore((state) => state.clearUserBudgets);
    const clearUserCategories = useStore((state) => state.clearUserCategories);

    const handleOpenNavMenu = (e: React.MouseEvent) => {
        setAnchorElNav(e.currentTarget as HTMLElement);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleLogout: ButtonChangeHandler = (e) => {
        e.preventDefault();
        router!.replace("/");
        clearEmail();
        clearId();
        clearUserCategories();
        clearUserBudgets();
        setAuth(false);
        (async () => {
            await deleteJWTCookie("token");
            await deleteJWTCookie("refreshToken");
        })().catch((err) => console.log(err));
    };

    useEffect(() => {
        setMounted(true);
    });
    let headerItems;

    if (!mounted) {
        headerItems = [
            { name: "Portfolio", href: "/home/#/portfolio" },
            { name: "Budget", href: "/home/#/budget" },
            { name: "Home", href: "/home/#" },
            { name: "Investment", href: "/home/#/invest" },
            { name: "Game", href: "/home/#/game" },
        ];
    } else {
        headerItems = [
            { name: "Portfolio", href: `/home/${userId}/portfolio` },
            { name: "Budget", href: `/home/${userId}/budget` },
            { name: "Home", href: `/home/${userId}` },
            { name: "Investment", href: `/home/${userId}/invest` },
            { name: "Game", href: `/home/${userId}/game` },
        ];
    }

    return (
        <div className="sm:py-5 py-2  flex w-full leading=[1.8em] justify-between flex-row items-center shrink-0">
            <h1 className="text-xl font-bold sm:text-3xl">INVEBB</h1>
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
                            anchorElNav ? handleCloseNavMenu : handleOpenNavMenu
                        }
                        color="neutral"
                        size="md"
                        className="ml-2"
                    >
                        <MenuIcon />
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
                        <MenuItem onClick={handleLogout as MouseEventHandler}>
                            Logout
                        </MenuItem>
                    </Menu>
                </Dropdown>
            </Box>

            <Box sx={{ display: { xs: "none", md: "flex" } }}>
                {headerItems.map((item, key) => (
                    <PageLink key={key} className="mr-5" href={item.href}>
                        {item.name}
                    </PageLink>
                ))}
                <Button
                    sx={(theme) => ({ color: theme.palette.text.primary })}
                    className="mr-5"
                    onClick={handleLogout}
                >
                    Logout
                </Button>
                <DarkModeToggle />
            </Box>
        </div>
    );
};

export default Header;
