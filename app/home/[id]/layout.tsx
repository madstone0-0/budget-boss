"use client";
import React, { ReactNode } from "react";
import Header from "../../../src/components/Header";
import { useRouter } from "next/navigation";

export default function HomeLayout({ children }: { children: ReactNode }) {
    const router = useRouter();
    return (
        <div>
            <Header router={router} />
            {children}
        </div>
    );
}
