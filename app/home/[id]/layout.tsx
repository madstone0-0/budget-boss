"use client";
import React, { ReactNode, Suspense } from "react";
import Header from "../../../src/components/Header";
import { useRouter } from "next/navigation";
import LoadingBar from "../../../src/components/LoadingBar";

export default function HomeLayout({ children }: { children: ReactNode }) {
    const router = useRouter();
    return (
        <>
            <Header router={router} />
            <Suspense fallback={<LoadingBar />}>{children}</Suspense>
        </>
    );
}
