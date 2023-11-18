import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { Currency, Options } from "../types";

const initialOptions: Options = {
    currency: "₵",
};

type State = {
    options: Options;
};

type Actions = {
    updateCurrency: (currency: Currency) => void;
};

const usePersistantStore = create<State & Actions>()(
    immer(
        devtools(
            persist(
                (set) => ({
                    options: initialOptions,
                    updateCurrency: (currency) =>
                        set((state) => {
                            state.options.currency = currency;
                        }),
                }),
                {
                    name: "persistant-storage",
                },
            ),
        ),
    ),
);

export default usePersistantStore;
