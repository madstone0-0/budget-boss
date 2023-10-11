import React from "react";
import Hero from "../src/components/Hero";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Page = () => {
    const headerItems = [
        { name: "About", href: "/about" },
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
            <Footer />
        </>
    );
};

export default Page;
