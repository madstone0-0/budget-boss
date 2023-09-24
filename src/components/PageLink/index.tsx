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
    <div className="flex items-center">
        <Link {...other} component={NextLink} passHref={passHref} href={href}>
            {children}
        </Link>
    </div>
);

export default PageLink;
