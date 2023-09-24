import React, { ChangeEventHandler, MouseEventHandler } from "react";

export type InputChangeHandler = ChangeEventHandler<HTMLInputElement>;
export type ButtonChangeHandler = MouseEventHandler<HTMLButtonElement>;

export interface NewUser {
    email: string;
    password: string;
}

export interface User {
    email: string;
    id: string | null;
    isAuthed: boolean;
    hasCreatedBudget: boolean;
    categories: Category[];
    budgets: Budget[];
}

export interface UserDetails {
    id: string;
    email: string;
    hasCreatedBudget: boolean;
    accessToken: string;
    refreshToken: string;
}

export interface Budget {
    name: string;
    id: number;
    userId: string;
    dateAdded: Date;
    amount: number;
    categoryId: number;
}

export interface NewBudget {
    name: string;
    userId: string;
    dateAdded: Date;
    amount: number;
    categoryId: number;
}

export interface ValidationResponse {
    type: string;
    value: string;
    msg: string;
    path: string;
    location: string;
}

export interface Category {
    categoryId: number;
    name: string;
    userId: string | null;
    color: string;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IFetch {
    get: (url: string) => Promise<any>;
    post: (url: string, data: any) => Promise<any>;
    put: (url: string, data: any) => Promise<any>;
    delete: (url: string) => Promise<any>;
}
/* eslint-enable @typescript-eslint/no-explicit-any */
