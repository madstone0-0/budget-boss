"use client";
import { Box, Button, Dropdown, IconButton, MenuButton } from "@mui/joy";
import { styled } from "@mui/joy/styles";

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
    mountedHeaderItems = [],
    unMountedHeaderItems = [],
}: {
    mountedHeaderItems?: HeaderItem[];
    unMountedHeaderItems?: HeaderItem[];
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

    const Background = styled("div")(({ theme }) => {
        const [monuted, setMounted] = useState(false);
        useEffect(() => {
            setMounted(true);
        }, []);

        const result = {
            backgroundColor: theme.palette.background.body,
            padding: "1.0rem 1.5rem 1.0rem 1.5rem",
            position: "sticky",
            top: 0,
            display: "flex",
            width: "100%",
            zIndex: 100,
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: "row",
            flexShrink: 0,
            boxShadow:
                "0 0 4px 0 rgba(0, 0, 0, 0.08), 0 2px 4px 0 rgba(0, 0, 0, 0.12)",
        };

        if (mounted) {
            const mql = window.matchMedia("(max-width: 640px)");

            if (mql.matches.valueOf()) {
                result.padding = "1.25rem 1.5rem 1.25rem 1.5rem";
            }
        }

        return result;
    });

    return (
        <Background>
            <h1 className="text-xl font-bold sm:text-3xl">INVEBB</h1>
            <Box
                sx={{
                    flexGrow: 0,
                    display: { xs: "flex", md: "none" },
                }}
            >
                {headerItems.length > 0 ? (
                    <Dropdown>
                        <MenuButton
                            slots={{ root: IconButton }}
                            slotProps={{
                                root: { variant: "outlined", color: "neutral" },
                            }}
                            onClick={
                                anchorElNav
                                    ? handleCloseNavMenu
                                    : handleOpenNavMenu
                            }
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
                                <MenuItem
                                    key={key}
                                    onClick={handleCloseNavMenu}
                                >
                                    <PageLink href={item.href} passHref>
                                        {item.name}
                                    </PageLink>
                                </MenuItem>
                            ))}
                            {mounted && userId ? (
                                <MenuItem
                                    onClick={handleLogout as MouseEventHandler}
                                >
                                    Logout
                                </MenuItem>
                            ) : (
                                <></>
                            )}
                        </Menu>
                    </Dropdown>
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
                    <Button
                        sx={(theme) => ({
                            color: theme.palette.text.primary,
                            marginRight: "1.25rem",
                        })}
                        onClick={handleLogout}
                    >
                        Logout
                    </Button>
                ) : (
                    <></>
                )}
                <DarkModeToggle />
            </Box>
        </Background>
    );
};

export default Header;
