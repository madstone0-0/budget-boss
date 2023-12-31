let HOST = "";

switch (process.env.NODE_ENV) {
    case "development":
        HOST = "http://localhost:10500";
        break;
    case "production":
        HOST = "https://budget-boss-backend.onrender.com";
        break;
    default:
        HOST = "http://localhost:10500";
        break;
}

export const API_BASE = `${HOST}`;

export const API_LOG_IN = "/auth/login";
export const API_SIGN_UP = "/auth/signup";
export const API_DELETE_ACC = "/auth/delete/";

export const API_GET_ALL_BUDGETS = "/budget/all/";
export const API_ADD_BUDGET = "/budget/add/";
export const API_UPDATE_BUDGET = "/budget/update/";
export const API_DELETE_BUDGET = "/budget/delete/";
export const API_GET_BUDGET_TOTAL = (
    userId: string,
    categoryId: string | number,
) => `/budget/total/${userId}/${categoryId}`;
export const API_CREATE_BUDGET_OPTIONS = "/budget/options/create/";
export const API_GET_BUDGET_OPTIONS = "/budget/options/";
export const API_UPDATE_BUDGET_OPTIONS = "/budget/options/update/";
export const API_DELETE_BUDGET_OPTIONS = "/budget/options/delete/";
export const API_USER_CREATED_TEMPLATE = "/budget/options/createdTemplate/";

export const API_GET_ALL_CATEGORY = "/category/all/";
export const API_ADD_CATEGORY = "/category/add/";
export const API_UPDATE_CATEGORY = "/category/update/";
export const API_DELETE_CATEGORY = "/category/delete/";

export const CURRENCIES: { readonly sym: string; readonly name: string }[] = [
    { sym: "$", name: "USD" },
    { sym: "₵", name: "GHS" },
    { sym: "$", name: "AUD" },
    { sym: "¥", name: "CNY" },
];
