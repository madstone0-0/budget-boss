import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { Budget, Category, User } from "../types";

type State = {
    user: User;
};

type Actions = {
    updateEmail: (email: string) => void;
    updateId: (id: string) => void;
    clearEmail: () => void;
    clearId: () => void;
    setAuth: (value: boolean) => void;
    setHasCreatedBudget: (value: boolean) => void;

    updateUserCategories: (categories: Category[]) => void;
    clearUserCategories: () => void;

    updateUserBudgets: (budgets: Budget[]) => void;
    clearUserBudgets: () => void;
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
                        categories: [],
                        budgets: [],
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
                    setHasCreatedBudget: (value) =>
                        set((state) => {
                            state.user.hasCreatedBudget = value;
                        }),

                    updateUserCategories: (categories: Category[]) =>
                        set((state) => {
                            state.user.categories = categories;
                        }),
                    clearUserCategories: () =>
                        set((state) => {
                            state.user.categories = [];
                        }),

                    updateUserBudgets: (budgets: Budget[]) =>
                        set((state) => {
                            state.user.budgets = budgets;
                        }),
                    clearUserBudgets: () =>
                        set((state) => {
                            state.user.budgets = [];
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
