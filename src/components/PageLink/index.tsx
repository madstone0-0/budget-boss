"use client";
import React, { ReactNode } from "react";
import NextLink from "next/link";
import Link, { LinkTypeMap } from "@mui/joy/Link";

const PageLink = ({
    children,
    href,
    passHref = false,
    other,
}: {
    children: ReactNode;
    href: string;
    passHref?: boolean;
    other?: LinkTypeMap["props"];
}) => (
    <Link
        {...other}
        className="flex justify-center items-center h-full w-fit"
        component={NextLink}
        passHref={passHref}
        href={href}
    >
        {children}
    </Link>
);

export default PageLink;
