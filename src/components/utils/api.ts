import { getJWTCookie } from "@/actions";
import {
    API_ADD_BUDGET,
    API_ADD_CATEGORY,
    API_DELETE_BUDGET,
    API_DELETE_CATEGORY,
    API_GET_ALL_BUDGETS,
    API_GET_ALL_CATEGORY,
    API_GET_BUDGET_OPTIONS,
    API_GET_BUDGET_TOTAL,
    API_UPDATE_BUDGET,
    API_UPDATE_BUDGET_OPTIONS,
    API_UPDATE_CATEGORY,
} from "../constants";
import { fetch } from "../utils/Fetch";
import {
    Budget,
    BudgetOptions,
    Category,
    NewBudget,
    NewCategory,
    NewUserBudgetOptions,
    User,
} from "../types";

export const getBudgets = async (user: User) => {
    const token = await getJWTCookie("token");
    if (token !== undefined) {
        const res = await fetch.get<{ budgets: Budget[] }>(
            `${API_GET_ALL_BUDGETS}${user.id}`,
            {
                headers: {
                    Authorization: `Bearer ${token.value}`,
                },
            },
        );
        res.data.budgets = res.data.budgets.map((budget) => ({
            ...budget,
            dateAdded: new Date(budget.dateAdded),
        }));
        return res.data;
    }
    throw Error("Cannot get jwt token");
};

export const getCategories = async (user: User) => {
    const token = await getJWTCookie("token");
    if (token !== undefined) {
        const res = await fetch.get<{ categories: Category[] }>(
            `${API_GET_ALL_CATEGORY}${user.id}`,
            {
                headers: {
                    Authorization: `Bearer ${token.value}`,
                },
            },
        );
        return res.data;
    }
    throw Error("Cannot get jwt token");
};

export const postBudgets = async ({
    budget,
    user,
}: {
    budget: NewBudget;
    user: User;
}) => {
    const token = await getJWTCookie("token");

    if (token !== undefined) {
        const res = await fetch.post<{ msg: string }>(
            `${API_ADD_BUDGET}${user.id}`,
            budget,
            {
                headers: {
                    Authorization: `Bearer ${token.value}`,
                },
            },
        );
        return res;
    }
    throw Error("Cannot get jwt token");
};

export const postCategories = async ({
    category,
    user,
}: {
    category: NewCategory;
    user: User;
}) => {
    const token = await getJWTCookie("token");
    // const totalWeight = categoryQuery.data?.categories.reduce(
    //     (acc, item) => acc + Number(item.weight),
    //     parseInt(category.weight),
    // );
    // console.log({ totalWeight });
    //
    // if (totalWeight && totalWeight > 100) {
    //     throw Error("Total weight cannot be more than 100");
    // }

    if (token !== undefined) {
        const res = await fetch.post<{ msg: string }>(
            `${API_ADD_CATEGORY}${user.id}`,
            category,
            {
                headers: {
                    Authorization: `Bearer ${token.value}`,
                },
            },
        );
        return res;
    }
    throw Error("Cannot get jwt token");
};

export const putBudgets = async ({
    budget,
    id,
}: {
    budget: NewBudget;
    id: string;
}) => {
    const token = await getJWTCookie("token");

    if (token !== undefined) {
        const res = await fetch.put<{ msg: string }>(
            `${API_UPDATE_BUDGET}${id}`,
            budget,
            {
                headers: {
                    Authorization: `Bearer ${token.value}`,
                },
            },
        );
        return res;
    }
    throw Error("Cannot get jwt token");
};

export const putCategories = async ({
    category,
    id,
}: {
    category: NewCategory;
    id: string;
}) => {
    const token = await getJWTCookie("token");
    // const totalWeight = categoryQuery.data?.categories.reduce(
    //     (acc, item) => acc + Number(item.weight),
    //     0,
    // );
    // console.log({ totalWeight });
    //
    // if (totalWeight && totalWeight > 100) {
    //     throw Error("Total weight cannot be more than 100");
    // }

    if (token !== undefined) {
        const res = await fetch.put<{ msg: string }>(
            `${API_UPDATE_CATEGORY}${id}`,
            category,
            {
                headers: {
                    Authorization: `Bearer ${token.value}`,
                },
            },
        );
        return res;
    }
    throw Error("Cannot get jwt token");
};

export const deleteBudgets = async (id: string) => {
    const token = await getJWTCookie("token");

    if (token !== undefined) {
        const res = await fetch.delete<{ msg: string }>(
            `${API_DELETE_BUDGET}${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token.value}`,
                },
            },
        );
        return res;
    }
    throw Error("Cannot get jwt token");
};

export const deleteCategories = async (id: string) => {
    const token = await getJWTCookie("token");

    if (token !== undefined) {
        const res = await fetch.delete<{ msg: string }>(
            `${API_DELETE_CATEGORY}${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token.value}`,
                },
            },
        );
        return res;
    }
    throw Error("Cannot get jwt token");
};

export const getBudgetTotal = async (
    userId: string,
    categoryId: number | string,
) => {
    const token = await getJWTCookie("token");

    if (token !== undefined) {
        const res = await fetch.get<{ total: string | null }>(
            `${API_GET_BUDGET_TOTAL(userId, categoryId)}`,
            {
                headers: {
                    Authorization: `Bearer ${token.value}`,
                },
            },
        );
        return res.data;
    }
    throw Error("Cannot get jwt token");
};

export const getBudgetOption = async (user: User) => {
    const token = await getJWTCookie("token");
    if (token !== undefined) {
        const res = await fetch.get<{ budgetOptions: BudgetOptions }>(
            `${API_GET_BUDGET_OPTIONS}${user.id!}`,
            {
                headers: {
                    Authorization: `Bearer ${token.value}`,
                },
            },
        );
        console.log({ res });
        return res.data;
    }
    throw Error("Cannot get jwt token");
};

export const putBudgetOption = async ({
    user,
    newUserBudget,
}: {
    user: User;
    newUserBudget: Partial<NewUserBudgetOptions>;
}) => {
    const token = await getJWTCookie("token");

    if (token !== undefined) {
        const res = await fetch.put<{ msg: string }>(
            `${API_UPDATE_BUDGET_OPTIONS}${user.id}`,
            newUserBudget,
            {
                headers: {
                    Authorization: `Bearer ${token.value}`,
                },
            },
        );
        return res;
    }
    throw Error("Cannot get jwt token");
};
