import React from "react";
import Hero from "../src/components/Hero";
import Header from "@/components/Header";

const Page = () => {
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
            <Hero />
        </>
    );
};

export default Page;
