"use client";
import React, { useState, useEffect } from "react";
import useStore from "../stores";
import { ButtonChangeHandler } from "../types";
import { useRouter } from "next/navigation";
import { deleteJWTCookie } from "@/actions";
import { Avatar, Button } from "@mui/joy";

const ProfilePage = () => {
    const [mounted, setMounted] = useState(false);

    const user = useStore((state) => state.user);
    const clearUser = useStore((state) => state.clearUser);
    const router = useRouter();

    const handleLogout: ButtonChangeHandler = (e) => {
        e.preventDefault();
        clearUser();
        (async () => {
            await deleteJWTCookie("token");
            await deleteJWTCookie("refreshToken");
        })().catch((err) => console.log(err));
        router.prefetch("/");
        router.replace("/");
    };

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted)
        return (
            <div>
                <Avatar>US</Avatar>
                <h1>user@email.com</h1>
                <Button>Logout</Button>
            </div>
        );

    return (
        <div className="flex flex-col justify-center items-center p-5 space-y-10 align-middle">
            <Avatar
                variant="soft"
                sx={{
                    height: "10rem",
                    width: "10rem",
                    fontSize: "5rem",
                }}
                alt="user avatar"
                size="lg"
            >
                {user.email.slice(0, 2).toUpperCase()}
            </Avatar>
            <h1 className="text-xl sm:text-3xl">{user.email}</h1>
            <Button onClick={handleLogout}>Logout</Button>
        </div>
    );
};

export default ProfilePage;
