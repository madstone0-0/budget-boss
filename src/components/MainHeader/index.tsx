"use client";
import { Box, Dropdown, IconButton, MenuButton } from "@mui/joy";
import React, { useState } from "react";
import DarkModeToggle from "../DarkModeToggle";
import { AiOutlineMenu } from "react-icons/ai";
import Menu from "@mui/joy/Menu";
import MenuItem from "@mui/joy/MenuItem";
import PageLink from "../PageLink";

const MainHeader = () => {
    const [anchorElNav, setAnchorElNav] = useState<HTMLElement | null>(null);

    const handleOpenNavMenu = (e: React.MouseEvent) => {
        setAnchorElNav(e.currentTarget as HTMLElement);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const headerItems = [
        { name: "Sign Up", href: "/signup" },
        { name: "Login", href: "/login" },
    ];

    return (
        <div className="sm:py-5 p-2 flex w-full leading=[1.8em] justify-between flex-row items-center shrink-0">
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
                        className="ml-2"
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

export default MainHeader;
