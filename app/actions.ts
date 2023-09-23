"use server";
import { cookies } from "next/headers";

export async function createJWTCookie(key: string, value: string) {
    cookies().set(key, value, {
        secure: true,
    });
}

export async function getJWTCookie(key: string) {
    return cookies().get(key);
}

export async function deleteJWTCookie(key: string) {
    cookies().delete(key);
}
