"use client";
import React, { ReactNode } from "react";
import NextLink from "next/link";
import Link, { LinkTypeMap } from "@mui/joy/Link";

const PageLink = ({
    children,
    href,
    passHref = false,
    className = "flex justify-center items-center h-full w-fit",
    other,
}: {
    children: ReactNode;
    href: string;
    passHref?: boolean;
    className?: React.HTMLAttributes<HTMLAnchorElement>["className"];
    other?: LinkTypeMap["props"];
}) => (
    <Link
        {...other}
        className={className}
        component={NextLink}
        passHref={passHref}
        href={href}
    >
        {children}
    </Link>
);

export default PageLink;
