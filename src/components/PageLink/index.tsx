"use client";
import React, { ReactNode } from "react";
import NextLink from "next/link";
import Link from "@mui/joy/Link";

const PageLink = ({
    children,
    href,
    passHref = false,
    className = "",
}: {
    children: ReactNode;
    href: string;
    passHref?: boolean;
    className?: string;
}) => (
    <div className="flex items-center">
        <Link
            className={className}
            component={NextLink}
            passHref={passHref}
            href={href}
        >
            {children}
        </Link>
    </div>
);

export default PageLink;
