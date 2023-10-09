import {
    Avatar,
    Dropdown,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
} from "@mui/joy";
import React, { useState, useCallback, MouseEventHandler } from "react";
import { MenuItems } from "../types";

interface UserProps {
    email: string;
    menuItems: MenuItems[];
}

const User = ({ email, menuItems }: UserProps) => {
    const [open, setOpen] = useState<boolean>(false);
    const [anchorElNav, setAnchorElNav] = useState<HTMLElement | null>(null);

    const handleOpenChange = useCallback(
        (
            _e:
                | React.MouseEvent
                | React.KeyboardEvent
                | React.FocusEvent
                | null,
            isOpen: boolean,
        ) => {
            setOpen(isOpen);
        },
        [],
    );

    return (
        <div className="mr-5">
            <Dropdown open={open} onOpenChange={handleOpenChange}>
                <MenuButton
                    slots={{ root: Avatar }}
                    slotProps={{ root: { variant: "soft", alt: email } }}
                >
                    {email.slice(0, 2).toUpperCase()}
                </MenuButton>
                <Menu id="avatar-menu" keepMounted>
                    {menuItems.map((item, key) => (
                        <MenuItem
                            key={key}
                            onClick={item.onClick as MouseEventHandler}
                        >
                            {item.name}
                        </MenuItem>
                    ))}
                </Menu>
            </Dropdown>
        </div>
    );
};

export default User;
