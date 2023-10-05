import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { HeaderItem, User } from "../types";

type State = {
    user: User;
    landingHeaderItems: HeaderItem[];
};

type Actions = {
    updateEmail: (email: string) => void;
    updateId: (id: string) => void;
    clearEmail: () => void;
    clearId: () => void;
    clearUser: () => void;
    setAuth: (value: boolean) => void;
    setHasCreatedBudget: (value: boolean) => void;
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
                        hasCreatedBudget: false,
                        // categories: [],
                        // budgets: [],
                    },
                    landingHeaderItems: [
                        { name: "Home", href: "/" },
                        { name: "Sign Up", href: "/signup" },
                        { name: "Login", href: "/login" },
                        { name: "About", href: "/about" },
                    ],
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
                    clearUser: () =>
                        set((state) => {
                            state.user = {
                                email: "",
                                id: null,
                                isAuthed: false,
                                hasCreatedBudget: false,
                                // categories: [],
                                // budgets: [],
                            };
                        }),
                    setAuth: (value) =>
                        set((state) => {
                            state.user.isAuthed = value;
                        }),
                    setHasCreatedBudget: (value) =>
                        set((state) => {
                            state.user.hasCreatedBudget = value;
                        }),
                    //
                    // updateUserCategories: (categories: Category[]) =>
                    //     set((state) => {
                    //         state.user.categories = categories;
                    //     }),
                    // clearUserCategories: () =>
                    //     set((state) => {
                    //         state.user.categories = [];
                    //     }),
                    //
                    // updateUserBudgets: (budgets: Budget[]) =>
                    //     set((state) => {
                    //         state.user.budgets = budgets;
                    //     }),
                    // clearUserBudgets: () =>
                    //     set((state) => {
                    //         state.user.budgets = [];
                    //     }),
                }),
                {
                    name: "global-storage",
                },
            ),
        ),
    ),
);

export default useStore;
