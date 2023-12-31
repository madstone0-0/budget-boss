import React, { ChangeEventHandler, MouseEventHandler } from "react";
import { CURRENCIES } from "./constants";
import { UseQueryResult } from "react-query";

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
    // categories: Category[];
    // budgets: Budget[];
}

// export type Currency = "₵" | "$";
export type Currency = (typeof CURRENCIES)[number]["sym"];

export interface Options {
    currency: Currency;
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
    id: string;
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
    weight: string;
    userId: string | null;
    color: string;
}

export interface NewCategory {
    name: string;
    color: string;
    weight: string;
    userId?: string | null | undefined;
    categoryId?: number | undefined;
}

export interface HeaderItem {
    name: string;
    href: string;
}

export interface MenuItems {
    name: string;
    onClick: ButtonChangeHandler;
}

export type Series = {
    id: string;
    value: number;
    label: string;
    color: string;
}[];

export type NewUserBudgetOptions = {
    userId: string;
    budgetOptions: unknown;
};

export type BudgetOptions = {
    id: string;
    userId: string;
    budgetOptions: {
        income: number;
        options: { weight: number; category: Partial<Category> }[];
    };
};

export type CategoryTotal = {
    categoryId: number;
    total: number | null;
};

export type Value<T, Handler = InputChangeHandler> = {
    label: string;
    placeholder: string;
    value$: T;
    onChange: Handler;
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IFetch {
    get: (url: string) => Promise<any>;
    post: (url: string, data: any) => Promise<any>;
    put: (url: string, data: any) => Promise<any>;
    delete: (url: string) => Promise<any>;
}
/* eslint-enable @typescript-eslint/no-explicit-any */
