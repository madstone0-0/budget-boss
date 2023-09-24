import React from "react";
import DetailsPage from "@/components/DetailsPage";
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
            <DetailsPage />
        </>
    );
};

export default Page;
