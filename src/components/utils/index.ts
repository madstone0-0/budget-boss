import React, { useEffect } from "react";
import usePersistantStore from "../stores/persistantStore";
import { CURRENCIES } from "../constants";

export const writeToLocalStore = (key: string, value: string) => {
    localStorage.setItem(key, JSON.stringify(value));
};

/* eslint-disable @typescript-eslint/no-unsafe-return*/
export const readFromLocalStore = (key: string) => {
    const value = localStorage.getItem(key);
    if (value != null) {
        return JSON.parse(value);
    }
    return null;
};
/* eslint-disable @typescript-eslint/no-unsafe-return*/

// https://stackoverflow.com/a/69058154
export const isTokenExpired = (token: string) => {
    try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split("")
                .map(
                    (c) =>
                        "%" + ("00" + c.charCodeAt(0).toString(16).slice(-2)),
                )
                .join(""),
        );

        const { exp } = JSON.parse(jsonPayload);
        const expired = Date.now() >= exp * 1000;
        return expired;
    } catch {
        return true;
    }
};

export const getDateString = (date: Date) => {
    return date.toISOString().split("T")[0];
};

export const addScrollProperty = () => {
    window.addEventListener(
        "scroll",
        () => {
            const windowPercent = scrollY / screen["availHeight"];
            const windowPercentBound = 0.5;

            const moveCondition = windowPercent >= windowPercentBound;
            console.log({ scrollY, windowPercent });

            const scrollVal = moveCondition
                ? (scrollY - windowPercentBound * screen["availHeight"]) /
                  innerHeight
                : 0;

            document.body.style.setProperty("--scroll", scrollVal.toString());
        },
        false,
    );
};

export const useScrollEffect = (
    setMounted: React.Dispatch<React.SetStateAction<boolean>>,
) => {
    const fn = () => {
        const windowPercent = scrollY / screen["availHeight"];
        const windowPercentBound = 0.5;

        const moveCondition = windowPercent >= windowPercentBound;
        console.log({ scrollY, windowPercent });

        const scrollVal = moveCondition
            ? (scrollY - windowPercentBound * screen["availHeight"]) /
              innerHeight
            : 0;

        document.body.style.setProperty("--scroll", scrollVal.toString());
    };

    useEffect(() => {
        setMounted(true);
        window.addEventListener("scroll", fn);
        return () => {
            window.removeEventListener("scroll", fn);
        };
    }, []);
};

export const useCurrencyFormatter = () => {
    const currency = usePersistantStore((state) => state.options.currency);
    const formatter = Intl.NumberFormat("en-US", {
        style: "currency",
        currency: CURRENCIES.find((c) => c.sym === currency)?.name || "GHS",
        currencyDisplay: "narrowSymbol",
    });

    return { formatter };
};
