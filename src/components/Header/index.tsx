"use client";
import {
    Avatar,
    Box,
    Button,
    Dropdown,
    IconButton,
    MenuButton,
} from "@mui/joy";
import { styled } from "@mui/system";

import React, { MouseEventHandler, useEffect, useState } from "react";
import DarkModeToggle from "../DarkModeToggle";
import { MenuIcon } from "lucide-react";
import Menu from "@mui/joy/Menu";
import MenuItem from "@mui/joy/MenuItem";
import PageLink from "../PageLink";
import useStore from "../stores/index.ts";
import { usePathname, useRouter } from "next/navigation";
import { ButtonChangeHandler, HeaderItem } from "../types.ts";
import { deleteJWTCookie } from "../../../app/actions.ts";
import User from "../User/index.tsx";

const Header = ({
    mountedHeaderItems = [],
    unMountedHeaderItems = [],
}: {
    mountedHeaderItems?: HeaderItem[];
    unMountedHeaderItems?: HeaderItem[];
}) => {
    const [anchorElNav, setAnchorElNav] = useState<HTMLElement | null>(null);
    const [mounted, setMounted] = useState<boolean>(false);
    const router = useRouter();
    const pathName = usePathname();

    const userId = useStore((state) => state.user.id);
    const userEmail = useStore((state) => state.user.email);
    const clearUser = useStore((state) => state.clearUser);

    const handleOpenNavMenu = (e: React.MouseEvent) => {
        setAnchorElNav(e.currentTarget as HTMLElement);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleLogout: ButtonChangeHandler = (e) => {
        e.preventDefault();
        clearUser();
        (async () => {
            await deleteJWTCookie("token");
            await deleteJWTCookie("refreshToken");
        })().catch((err) => console.log(err));
        router.prefetch("/");
        router.replace("/");
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

    const Background = styled("div")(({ theme }) => ({
        backgroundColor: theme.palette.background.body,
        padding: "1.0rem 1.5rem 1.0rem 1.5rem",
        position: "sticky",
        top: 0,
        display: "flex",
        width: "100%",
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        flexShrink: 0,
        boxShadow:
            "0 0 4px 0 rgba(0, 0, 0, 0.08), 0 2px 4px 0 rgba(0, 0, 0, 0.12)",
        zIndex: 1,
    }));

    return (
        <Background>
            {pathName.includes("home") ? (
                <h1 className="text-3xl font-bold sm:text-3xl">INVEBB</h1>
            ) : (
                <PageLink
                    href="/"
                    passHref
                    className="!text-3xl font-bold !sm:text-3xl"
                >
                    INVEBB
                </PageLink>
            )}
            <Box
                sx={{
                    flexGrow: 0,
                    display: { xs: "flex", md: "none" },
                }}
            >
                {headerItems.length > 0 ? (
                    <>
                        <Dropdown>
                            <MenuButton
                                slots={{ root: IconButton }}
                                slotProps={{
                                    root: {
                                        variant: "outlined",
                                        color: "primary",
                                    },
                                }}
                                // onClick={
                                //     anchorElNav != null
                                //         ? handleCloseNavMenu
                                //         : handleOpenNavMenu
                                // }
                                sx={{
                                    marginRight: "1.25rem",
                                    width: 40,
                                }}
                                color="neutral"
                                size="md"
                            >
                                <MenuIcon />
                            </MenuButton>
                            <Menu
                                // open={Boolean(anchorElNav)}
                                // onClose={handleCloseNavMenu}
                                sx={{
                                    display: { xs: "block", md: "none" },
                                }}
                                id="menu-header"
                                keepMounted
                                // anchorEl={anchorElNav}
                            >
                                {headerItems.map((item, key) => (
                                    <MenuItem key={key}>
                                        <PageLink href={item.href} passHref>
                                            {item.name}
                                        </PageLink>
                                    </MenuItem>
                                ))}
                            </Menu>
                        </Dropdown>
                        {mounted && userId != null ? (
                            <div className="mr-5">
                                <Avatar
                                    sx={{
                                        ":hover": {
                                            cursor: "pointer",
                                        },
                                    }}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        router.prefetch(
                                            `/home/${userId}/profile`,
                                        );
                                        router.push(`/home/${userId}/profile`);
                                    }}
                                >
                                    {userEmail.slice(0, 2).toUpperCase()}
                                </Avatar>
                            </div>
                        ) : (
                            <></>
                        )}
                    </>
                ) : (
                    <></>
                )}
                <DarkModeToggle />
            </Box>

            <Box
                sx={{
                    display: { xs: "none", md: "flex" },
                    alignItems: "center",
                }}
            >
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
                {mounted && userId ? (
                    <div className="mr-5">
                        <Avatar
                            sx={{
                                ":hover": {
                                    cursor: "pointer",
                                },
                            }}
                            onClick={(e) => {
                                e.preventDefault();
                                router.prefetch(`/home/${userId}/profile`);
                                router.push(`/home/${userId}/profile`);
                            }}
                        >
                            {userEmail.slice(0, 2).toUpperCase()}
                        </Avatar>
                    </div>
                ) : (
                    <></>
                )}
                <DarkModeToggle />
            </Box>
        </Background>
    );
};

export default Header;
