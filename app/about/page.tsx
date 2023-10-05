import Header from "@/components/Header";
import React from "react";

const Page = () => {
    const headerItems = [
        { name: "Home", href: "/" },
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
            <div className="flex flex-col my-2 mx-5 sm:my-5 sm:mx-10 h-[100vh]">
                <h1 className="text-5xl font-bold text-center">Our vision</h1>
            </div>
        </>
    );
};

export default Page;
