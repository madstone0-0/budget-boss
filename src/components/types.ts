import React, { ChangeEventHandler } from "react";

export type InputChangeHandler = ChangeEventHandler<HTMLInputElement>;

export interface NewUser {
    email: string;
    password: string;
}

export interface User {
    email: string;
    id: string | null;
    isAuthed: boolean;
}
