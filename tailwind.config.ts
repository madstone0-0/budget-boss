// module.exports = {
//     content: [
//         "./src/**/*.{js,ts,jsx,tsx}",
//         "./app/**/*.{js,ts,jsx,tsx}",
//         "./components/**/*.{js,ts,jsx,tsx}",
//     ],
//     theme: {
//         extend: {},
//     },
//     plugins: [],
// };

import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/**/*.{js,ts,jsx,tsx}",
        "./app/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {},
        fontFamily: {
            // sans: ["var(--font-inter)", "sans-serif"],
            // actor: ["var(--font-actor)", "sans-serif"],
            actor: ["Actor", "Inter", "sans-serif"],
        },
    },
    plugins: [],
};

export default config;
