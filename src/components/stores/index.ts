import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { User } from "../types";

type State = {
    user: User;
    updateEmail: (email: string) => void;
    updateId: (id: string) => void;
    clearEmail: () => void;
    clearId: () => void;
    setAuth: (value: boolean) => void;
};

const useStore = create<State>()(
    devtools(
        persist(
            (set) => ({
                user: {
                    email: "",
                    id: null,
                    isAuthed: false,
                },
                updateEmail: (email) =>
                    set((state) => ({
                        user: {
                            ...state.user,
                            email: email,
                        },
                    })),
                updateId: (id) =>
                    set((state) => ({
                        user: {
                            ...state.user,
                            id: id,
                        },
                    })),
                clearEmail: () =>
                    set((state) => ({
                        user: {
                            ...state.user,
                            email: "",
                        },
                    })),
                clearId: () =>
                    set((state) => ({
                        user: {
                            ...state.user,
                            id: null,
                        },
                    })),
                setAuth: (value) =>
                    set((state) => ({
                        user: {
                            ...state.user,
                            isAuthed: value,
                        },
                    })),
            }),
            {
                name: "global-storage",
            },
        ),
    ),
);

export default useStore;
