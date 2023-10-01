import { Inter, Actor } from "next/font/google";

export const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
    display: "swap",
    preload: false,
});

export const actor = Actor({
    subsets: ["latin"],
    variable: "--font-actor",
    display: "swap",
    weight: ["400"],
    preload: false,
});
