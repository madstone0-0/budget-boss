import Header from "@/components/Header";
import React from "react";

const Page = () => {
    const headerItems = [
        { name: "Home", href: "/" },
        { name: "About", href: "/about" },
        { name: "Sign Up", href: "/signup" },
        { name: "Login", href: "/login" },
    ];

    const info: { header: string; text: string }[] = [
        {
            header: "Who are we?",
            text: " We provide personalized budgeting templates and various investment oppoertunies. Users also have access to an investment simulation to practice investing in a risk free environment. We ensure that our users get the best quality financial education on investment and budgeting.",
        },
        {
            header: "Our Mission",
            text: " Our mission is to ensure that college students get access to quality financial education and investment opportunities.",
        },
        {
            header: "Our Vision",
            text: "Creating secure and reliable investments",
        },
    ];

    return (
        <>
            <Header
                mountedHeaderItems={headerItems}
                unMountedHeaderItems={headerItems}
            />
            <div className="flex flex-col my-2 mx-5 sm:my-5 sm:mx-10 h-[100vh]">
                {info.map((item, key) => (
                    <div className="flex flex-col m-5 space-y-10" key={key}>
                        <h1 className="text-5xl font-bold text-center">
                            {item.header}
                        </h1>
                        <p className="self-center text-lg text-justify">
                            {item.text}
                        </p>
                    </div>
                ))}
            </div>
        </>
    );
};

export default Page;
