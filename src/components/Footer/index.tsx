import React from "react";
import Image from "next/image";
import MUI from "../assets/MUI.svg";
import ReactLogo from "../assets/ReactLogo.svg";

const Footer = () => {
    const imgSize = 25;
    return (
        <div className="w-full flex flex-col items-center space-y-5 p-5 justify-center h-[40vh] bg-[#141617]/40 ">
            <h1 className="text-2xl">Powered by Vercel</h1>
            <div className="flex flex-row rounded-3xl w-60 h-14 items-center justify-center bg-[#1B232A]">
                <div className="flex flex-row space-x-2">
                    <Image
                        height={imgSize}
                        width={imgSize}
                        src={ReactLogo}
                        alt="React Logo"
                    />
                    <p className="text-xl">React</p>
                </div>
                <p className="text-xl"> + </p>
                <div className="flex flex-row space-x-2">
                    <Image
                        height={imgSize}
                        width={imgSize}
                        src={MUI}
                        alt="MUI Logo"
                    />
                    <p className="text-xl">MUI</p>
                </div>
            </div>
            <p className="text-xl">2023 Budget Bosses</p>
        </div>
    );
};

export default Footer;
