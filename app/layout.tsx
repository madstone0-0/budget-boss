import React from "react";
import "./globals.css";
import Theme from "../src/components/Theme";
import { actor, inter } from "./fonts";
import { addScrollProperty } from "@/components/utils";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html
            className={`${inter.variable} ${actor.variable}`}
            suppressHydrationWarning={true}
            lang="en"
        >
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossOrigin="anonymous"
                />
                <link
                    rel="stylesheet"
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
                />
                <link
                    rel="stylesheet"
                    href="https://fonts.googleapis.com/css2?family=Actor:wght@300;400;500;600;700&display=swap"
                />

                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0"
                />
                <title>INVEBB</title>
            </head>
            <body suppressHydrationWarning={true}>
                <Theme options={{ key: "joy" }}>{children}</Theme>
            </body>
        </html>
    );
}
