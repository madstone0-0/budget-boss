import React from "react";
import Tabs from "@mui/joy/Tabs";
import Tab from "@mui/joy/Tab";
import TabList from "@mui/joy/TabList";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import portfolio from "../assets/portfolio.svg";

const Header = ({ title = "INVEBB" }) => {
    const navItems = [
        { name: "Home", icon: portfolio },
        { name: "Portfolio", icon: portfolio },
        { name: "Budget", icon: portfolio },
    ];
    return (
        <>
            <Tab></Tab>
        </>
    );
};

export default Header;
