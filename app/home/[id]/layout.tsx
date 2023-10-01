"use client";
import React, { ReactNode, Suspense } from "react";
import Header from "../../../src/components/Header";
import LoadingBar from "../../../src/components/LoadingBar";
import useStore from "@/components/stores";

export default function HomeLayout({ children }: { children: ReactNode }) {
    const userId = useStore((state) => state.user.id);
    const headerItemsMounted = [
        { name: "Portfolio", href: `/home/${userId}/portfolio` },
        { name: "Budget", href: `/home/${userId}/budget` },
        { name: "Home", href: `/home/${userId}` },
        { name: "Investment", href: `/home/${userId}/invest` },
        { name: "Game", href: `/home/${userId}/game` },
    ];
    const headerItemsUnMounted = [
        { name: "Portfolio", href: "/home/#/portfolio" },
        { name: "Budget", href: "/home/#/budget" },
        { name: "Home", href: "/home/#" },
        { name: "Investment", href: "/home/#/invest" },
        { name: "Game", href: "/home/#/game" },
    ];

    return (
        <>
            <Header
                mountedHeaderItems={headerItemsMounted}
                unMountedHeaderItems={headerItemsUnMounted}
            />
            <div className="mx-5 sm:mx-10">
                <Suspense fallback={<LoadingBar />}>{children}</Suspense>
            </div>
        </>
    );
}
