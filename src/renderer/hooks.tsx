import React, { useContext } from "react";
import type { PageContext, Props } from "./types";

export { PageContextProvider };

export { usePageContext };

const Context = React.createContext<PageContext>(
    undefined as unknown as PageContext,
);

const PageContextProvider = ({ children, pageContext }: Props) => {
    return <Context.Provider value={pageContext}>{children}</Context.Provider>;
};

const usePageContext = () => {
    const pageContext = useContext(Context);
    return pageContext;
};
