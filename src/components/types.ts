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
}

export interface ValidationResponse {
    type: string;
    value: string;
    msg: string;
    path: string;
    location: string;
}
