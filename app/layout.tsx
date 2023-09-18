import React from "react";
import "./layout.css";
import "./output.css";
import Theme from "../src/components/Theme";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html suppressHydrationWarning={true} lang="en">
            <head>
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0"
                />
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
                <title>INVEBB</title>
            </head>
            <body suppressHydrationWarning={true}>
                <Theme>{children}</Theme>
            </body>
        </html>
    );
}
