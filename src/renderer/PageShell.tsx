import React from "react";
import { Props } from "./types.ts";
import { PageContextProvider } from "./hooks";
import "./PageShell.css";

export { PageShell };

const PageShell = ({ children, pageContext }: Props) => {
    return (
        <React.StrictMode>
            <PageContextProvider pageContext={pageContext}>
                <div className="container flex flex-col items-center m-10 w-full h-full">
                    <h1 className="text-3xl font-bold">INVEBB</h1>
                    <div className="flex flex-col">{children}</div>
                </div>
            </PageContextProvider>
        </React.StrictMode>
    );
};
