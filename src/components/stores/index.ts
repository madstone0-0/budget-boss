import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { User } from "../types";

type State = {
    user: User;
};

type Actions = {
    updateEmail: (email: string) => void;
    updateId: (id: string) => void;
    clearEmail: () => void;
    clearId: () => void;
    setAuth: (value: boolean) => void;
};

const useStore = create<State & Actions>()(
    immer(
        devtools(
            persist(
                (set) => ({
                    user: {
                        email: "",
                        id: null,
                        isAuthed: false,
                    },
                    updateEmail: (email) =>
                        set((state) => {
                            state.user.email = email;
                        }),
                    updateId: (id) =>
                        set((state) => {
                            state.user.id = id;
                        }),
                    clearEmail: () =>
                        set((state) => {
                            state.user.email = "";
                        }),
                    clearId: () =>
                        set((state) => {
                            state.user.id = null;
                        }),
                    setAuth: (value) =>
                        set((state) => {
                            state.user.isAuthed = value;
                        }),
                }),
                {
                    name: "global-storage",
                },
            ),
        ),
    ),
);

export default useStore;
