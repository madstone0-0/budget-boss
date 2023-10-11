import React from "react";
import DetailsPage from "../../src/components/DetailsPage";
import Header from "@/components/Header";

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
            <DetailsPage login />
        </>
    );
};

export default Page;
