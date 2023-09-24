"use client";
import { Box, Button, Dropdown, IconButton, MenuButton } from "@mui/joy";

import React, { MouseEventHandler, useEffect, useState } from "react";
import DarkModeToggle from "../DarkModeToggle";
import { MenuIcon } from "lucide-react";
import Menu from "@mui/joy/Menu";
import MenuItem from "@mui/joy/MenuItem";
import PageLink from "../PageLink";
import useStore from "../stores/index.ts";
import { useRouter } from "next/navigation";
import { ButtonChangeHandler, HeaderItem } from "../types.ts";
import { deleteJWTCookie } from "../../../app/actions.ts";

const Header = ({
    mountedHeaderItems,
    unMountedHeaderItems,
}: {
    mountedHeaderItems: HeaderItem[];
    unMountedHeaderItems: HeaderItem[];
}) => {
    const [anchorElNav, setAnchorElNav] = useState<HTMLElement | null>(null);
    const [mounted, setMounted] = useState<boolean>(false);
    const router = useRouter();

    const userId = useStore((state) => state.user.id);
    const clearUser = useStore((state) => state.clearUser);

    const handleOpenNavMenu = (e: React.MouseEvent) => {
        setAnchorElNav(e.currentTarget as HTMLElement);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleLogout: ButtonChangeHandler = (e) => {
        router.replace("/");
        e.preventDefault();
        clearUser();
        (async () => {
            await deleteJWTCookie("token");
            await deleteJWTCookie("refreshToken");
        })().catch((err) => console.log(err));
    };

    useEffect(() => {
        setMounted(true);
    });
    let headerItems: HeaderItem[];

    if (!mounted) {
        headerItems = unMountedHeaderItems;
    } else {
        headerItems = mountedHeaderItems;
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
                    <PageLink
                        key={key}
                        other={{
                            sx: {
                                marginRight: "1.5rem",
                            },
                        }}
                        href={item.href}
                    >
                        {item.name}
                    </PageLink>
                ))}
                <Button
                    sx={(theme) => ({
                        color: theme.palette.text.primary,
                        display: userId ? "block" : "none",
                        marginRight: "1.25rem",
                    })}
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
