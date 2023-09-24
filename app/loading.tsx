import React from "react";
import LoadingBar from "../src/components/LoadingBar";
import Header from "@/components/Header";

export default function Loading() {
    const headerItems = [
        { name: "Sign Up", href: "/signup" },
        { name: "Login", href: "/login" },
    ];
    return (
        <>
            <Header
                mountedHeaderItems={headerItems}
                unMountedHeaderItems={headerItems}
            />
            <LoadingBar />
        </>
    );
}
