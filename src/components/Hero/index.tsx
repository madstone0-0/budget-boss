"use client";
import React, { useState, useEffect } from "react";
import { styled } from "@mui/joy/styles";
import Image from "next/image";
import SvG1 from "../assets/1.svg";
import SvG2 from "../assets/2.svg";
import SvG3 from "../assets/3.svg";
import { actor } from "@/fonts";
import { addScrollProperty, useScrollEffect } from "../utils";

const HeroHeader = styled("h1")(({}) => {
    return {
        color: "#1B232A",
    };
});

const HeroSection = ({
    img,
    text,
    imgBefore = true,
    styles = {},
}: {
    img: string;
    text: string;
    imgBefore?: boolean;
    styles?: React.CSSProperties;
}) => {
    const ref = React.useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    const callBack = (entries: IntersectionObserverEntry[]) => {
        const [entry] = entries;
        setIsVisible(entry.isIntersecting);
    };

    const options = {
        threshold: 0.5,
    };

    useEffect(() => {
        const observer = new IntersectionObserver(callBack, options);
        if (ref.current) observer.observe(ref.current);

        return () => {
            if (ref.current) observer.unobserve(ref.current);
        };
    }, [ref, options]);

    const sectionText = () => (
        <p className="self-center font-actor w-[100%] md:w-[50%] text-xl sm:text-3xl font-bold text-center">
            {text}
        </p>
    );
    const sectionImg = () => (
        <Image
            src={img}
            className="w-[70%] md:w-[30%] h-auto inline-block"
            alt="Hero Image"
        />
    );
    return (
        <div
            ref={ref}
            className={`flex -z-10 md:flex-row min-w-[100vw] md:align-middle items-center justify-center min-h-[80vh] md:min-h-[100vh] space-y-10 md:space-x-20 flex-col p-5 md:px-20 ${
                isVisible ? "show" : "hide"
                // ""
            }`}
            style={styles}
        >
            {imgBefore ? (
                <>
                    {sectionImg()}
                    {sectionText()}
                </>
            ) : (
                <>
                    {sectionText()}
                    {sectionImg()}
                </>
            )}
        </div>
    );
};

const HeroPage = () => {
    const sectionItems: { img: string; text: string }[] = [
        { img: SvG1, text: "Save anytime anywhere" },
        { img: SvG2, text: "Save and invest at the same time" },
        { img: SvG3, text: "Transact fast and easy" },
    ];

    return (
        <div className="flex flex-col justify-center items-center w-full h-full">
            <div className="w-full flex flex-col p-5 h-[100vh] bg-[#8FE1D7] bg-gradient-to-tr from-current to-[#35DC9F]">
                <HeroHeader className="m-5 text-2xl font-bold text-center rounded-md sm:text-2xl md:text-5xl">
                    Change the Way You Invest
                </HeroHeader>
                <div className="self-center mt-10 h-full bg-black rounded-md min-w-[80vw] max-w-[80vw] md:min-w-[90vw]"></div>
            </div>
            <div className="flex flex-col my-10">
                {sectionItems.map((item, key) => (
                    <HeroSection
                        key={key}
                        imgBefore={key % 2 === 0}
                        text={item.text}
                        img={item.img}
                    />
                ))}
            </div>
        </div>
    );
};

export default HeroPage;
