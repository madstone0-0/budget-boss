"use client";
import React, { useState } from "react";
import {
    Budget,
    ButtonChangeHandler,
    Category,
    NewBudget,
    NewCategory,
} from "../types";
import { Button } from "@mui/joy";
import { Plus } from "lucide-react";
import { getDateString } from "../utils";
import { fetch } from "../utils/Fetch";
import useStore from "../stores";
import {
    API_ADD_BUDGET,
    API_ADD_CATEGORY,
    API_DELETE_BUDGET,
    API_DELETE_CATEGORY,
    API_GET_ALL_BUDGETS,
    API_GET_ALL_CATEGORY,
    API_UPDATE_BUDGET,
    API_UPDATE_CATEGORY,
} from "../constants";
import { useSnackbar } from "notistack";
import { getJWTCookie } from "../../../app/actions";
import Unauthorized from "../utils/Unauthorized";
import { useQueryClient, useQuery, useMutation, QueryKey } from "react-query";
import { AxiosError, AxiosResponse } from "axios";
import LoadingBar from "../LoadingBar";
import BudgetModal from "../BudgetModal";
import BudgetSingle from "../BudgetSingle";
import BudgetPie from "../BudgetPie";
import { Input } from "@mui/joy";

declare module "react-query" {
    interface Register {
        defaultError: AxiosError;
    }
}

const BudgetList = () => {
    const { enqueueSnackbar } = useSnackbar();

    const user = useStore((state) => state.user);

    const setAuth = useStore((state) => state.setAuth);

    const [open, setOpen] = useState<boolean>(false);

    const [budgetName, setBudgetName] = useState<string>("");
    const [budgetAmount, setBudgetAmount] = useState<string>("0");
    const [budgetDateAdded, setBudgetDateAdded] = useState<string>(
        getDateString(new Date()),
    );
    // const [budgetDateUpdated, setBudgetDateUpdated] = useState<Date>(
    //     new Date(Date.now()),
    // );
    const [budgetCategory, setBudgetCategory] = useState<number | null>(null);
    const [budgetType, setBudgetType] = useState<"income" | "expense">(
        "income",
    );

    const getDateAndYear = (date: Date) => {
        return !isNaN(date.valueOf())
            ? `${date.getFullYear()}-${date.getMonth() + 1}`
            : undefined;
    };

    const [displpayedBudgets, setDisplayedBudgets] = useState<Budget[]>([]);
    const [filterDate, setFilterDate] = useState<string | undefined>(
        getDateAndYear(new Date()),
    );

    const queryClient = useQueryClient();

    const getBudgets = async () => {
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
            setDisplayedBudgets(res.data.budgets);
            return res.data;
        }
        throw Error("Cannot get jwt token");
    };

    const getCategories = async () => {
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

    const postBudgets = async (budget: NewBudget) => {
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

    const postCategories = async (category: NewCategory) => {
        const token = await getJWTCookie("token");

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

    const putBudgets = async ({
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

    const putCategories = async ({
        category,
        id,
    }: {
        category: NewCategory;
        id: string;
    }) => {
        const token = await getJWTCookie("token");

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

    const deleteBudgets = async (id: string) => {
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

    const deleteCategories = async (id: string) => {
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

    const doOnError = (err: unknown, feebackFn: (msg: string) => void) => {
        console.log({ err });
        let err_msg = "";
        if (err instanceof AxiosError) {
            err_msg = err.response?.data.msg;
            if (err_msg === undefined) err_msg = err.message;
        } else if (err instanceof Error) {
            err_msg = err.message;
        } else {
            err_msg = "Unknown error";
        }

        feebackFn(err_msg);
    };

    const doOnSuccess = async (
        res: AxiosResponse,
        key: QueryKey,
        feebackFn: (msg: string) => void,
    ) => {
        if (res.data.msg !== null) {
            const msg = res.data.msg;
            if (msg instanceof String) feebackFn(msg.toString());
        }
        await queryClient.invalidateQueries(key);
    };

    const budgetQuery = useQuery({
        queryKey: "budgets",
        queryFn: getBudgets,
        onError: (err) =>
            doOnError(err, (msg) =>
                enqueueSnackbar(`Failed to get budgets: ${msg}`, {
                    variant: "error",
                }),
            ),
    });

    const budgetAddMutation = useMutation({
        mutationFn: postBudgets,
        onSuccess: async (res) => {
            const msg = res.data.msg;
            enqueueSnackbar(msg, { variant: "success" });
            setOpen(false);
            resetBudget();
            await queryClient.invalidateQueries({ queryKey: "budgets" });
        },
        onError: (err) =>
            doOnError(err, (msg) =>
                enqueueSnackbar(`Failed to add budget: ${msg}`, {
                    variant: "error",
                }),
            ),
    });

    const budgetEditMutation = useMutation({
        mutationFn: putBudgets,
        onSuccess: async (res) => {
            const msg = res.data.msg;
            enqueueSnackbar(msg, { variant: "success" });
            await queryClient.invalidateQueries({ queryKey: "budgets" });
        },
        onError: (err) =>
            doOnError(err, (msg) => {
                enqueueSnackbar(`Failed to edit budget: ${msg}`, {
                    variant: "error",
                });
            }),
    });

    const budgetDeleteMutation = useMutation({
        mutationFn: deleteBudgets,
        onSuccess: async (res) => {
            const msg = res.data.msg;
            enqueueSnackbar(msg, { variant: "success" });
            await queryClient.invalidateQueries({ queryKey: "budgets" });
        },
        onError: (err) =>
            doOnError(err, (msg) => {
                enqueueSnackbar(`Failed to delete budget: ${msg}`, {
                    variant: "error",
                });
            }),
    });

    const categoryQuery = useQuery({
        queryKey: "categories",
        queryFn: getCategories,
        onError: (err) =>
            doOnError(err, (msg) =>
                enqueueSnackbar(`Failed to get categories: ${msg}`, {
                    variant: "error",
                }),
            ),
    });

    const categoryAddMutation = useMutation({
        mutationFn: postCategories,
        onSuccess: async (res) => {
            const msg = res.data.msg;
            enqueueSnackbar(msg, { variant: "success" });
            await queryClient.invalidateQueries({ queryKey: "categories" });
        },
        onError: (err) =>
            doOnError(err, (msg) => {
                enqueueSnackbar(`Failed to add category: ${msg}`, {
                    variant: "error",
                });
            }),
    });

    const categoryEditMutation = useMutation({
        mutationFn: putCategories,
        onSuccess: async (res) => {
            const msg = res.data.msg;
            enqueueSnackbar(msg, { variant: "success" });
            await queryClient.invalidateQueries({ queryKey: "categories" });
        },
        onError: (err) =>
            doOnError(err, (msg) => {
                enqueueSnackbar(`Failed to edit category: ${msg}`, {
                    variant: "error",
                });
            }),
    });

    const categoryDeleteMutation = useMutation({
        mutationFn: deleteCategories,
        onSuccess: async (res) => {
            const msg = res.data.msg;
            enqueueSnackbar(msg, { variant: "success" });
            await queryClient.invalidateQueries({ queryKey: "categories" });
        },
        onError: (err) =>
            doOnError(err, (msg) => {
                enqueueSnackbar(`Failed to delete category: ${msg}`, {
                    variant: "error",
                });
            }),
    });

    const openModal: ButtonChangeHandler = (e) => {
        e.preventDefault();
        setOpen(true);
    };

    const closeModal: ButtonChangeHandler = (e) => {
        e.preventDefault();
        setOpen(false);
    };

    const resetBudget = () => {
        setBudgetName("");
        setBudgetAmount("0");
        setBudgetDateAdded(getDateString(new Date()));
        setBudgetType("income");
    };

    const generateBudget = () => {
        const budget: NewBudget = {
            name: budgetName,
            userId: user.id!,
            amount: Number(
                budgetType === "income" ? budgetAmount : -budgetAmount,
            ),
            dateAdded: new Date(budgetDateAdded),
            categoryId: budgetCategory!,
        };

        console.log({ budget });
        return budget;
    };

    const onAddBudget: ButtonChangeHandler = (e) => {
        e.preventDefault();
        if (
            ![budgetName, budgetDateAdded, budgetAmount].some(
                (item) => item == "",
            ) ||
            budgetCategory != null
        ) {
            budgetAddMutation.mutate(generateBudget());
        } else {
            enqueueSnackbar("Missing fields", { variant: "error" });
        }
    };

    const filterBudgets = (budgets: Budget[]) => {
        if (budgets.length == 0) return budgets;
        if (filterDate === "" || filterDate === undefined) return budgets;
        return budgets.filter(
            (budget) =>
                getDateAndYear(budget.dateAdded) == filterDate &&
                budget.userId == user.id,
        );
    };

    if (
        budgetQuery.isLoading ||
        // budgetQuery.isFetching ||
        categoryQuery.isLoading
        // categoryQuery.isFetching
    )
        return <LoadingBar />;

    if (budgetQuery.isError && budgetQuery.error != null) {
        if (
            budgetQuery.error instanceof AxiosError &&
            budgetQuery.error.status == 401
        )
            return <Unauthorized />;

        return (
            <div className="flex flex-col justify-center items-center my-52 h-full text-center">
                <h1 className="min-w-max text-2xl font-bold sm:text-3xl">
                    Something went wrong
                </h1>
                <p>
                    {budgetQuery.error instanceof AxiosError
                        ? budgetQuery.error.message
                        : budgetQuery.error instanceof Error
                        ? budgetQuery.error.message
                        : "Unknown Error"}
                </p>
            </div>
        );
    }
    const filteredBudgets =
        budgetQuery.data?.budgets !== undefined
            ? filterBudgets(budgetQuery.data.budgets)
            : [];

    return (
        <div className="flex flex-col space-y-5">
            <Input
                className="self-center min-w-min"
                size="lg"
                type="month"
                slotProps={{
                    input: {
                        min: "2000-01",
                        max: "3000-12",
                    },
                }}
                onChange={(e) =>
                    setFilterDate(getDateAndYear(new Date(e.target.value)))
                }
                value={filterDate}
            />
            <div className="flex flex-col justify-center items-center">
                <BudgetPie
                    budgets={filteredBudgets}
                    categories={
                        categoryQuery.data?.categories
                            ? categoryQuery.data.categories
                            : []
                    }
                    categoryMutations={{
                        editMutation: categoryEditMutation,
                        deleteMutation: categoryDeleteMutation,
                        addMutation: categoryAddMutation,
                    }}
                />
                {filteredBudgets.length !== 0 ? (
                    filteredBudgets.map((budget) => (
                        <BudgetSingle
                            key={budget.id}
                            budget={budget}
                            categories={
                                categoryQuery.data?.categories
                                    ? categoryQuery.data.categories
                                    : []
                            }
                            editMutation={budgetEditMutation}
                            deleteMutation={budgetDeleteMutation}
                        />
                    ))
                ) : (
                    <div className="flex flex-col justify-center items-center my-20 h-full text-center">
                        <h1 className="min-w-max text-2xl font-bold text-gray-500 sm:text-3xl">
                            No records for this month
                        </h1>
                    </div>
                )}
            </div>
            <BudgetModal
                open={open}
                onClose={closeModal}
                onSubmit={onAddBudget}
                buttonText="Add"
                buttonLoading={budgetAddMutation.isLoading}
                options={{
                    modalTitle: "Add Record",
                    name: {
                        value$: budgetName,
                        placeholder: "Enter record name",
                        label: "Name",
                        onChange: (e) => setBudgetName(e.target.value),
                    },
                    amount: {
                        value$: budgetAmount,
                        placeholder: "Enter amount",
                        label: "Amount",
                        onChange: (e) => setBudgetAmount(e.target.value),
                    },
                    dateAdded: {
                        value$: budgetDateAdded,
                        placeholder: "Enter date added",
                        label: "Date Added",
                        onChange: (e) => setBudgetDateAdded(e.target.value),
                    },
                    category: {
                        value$: budgetCategory,
                        placeholder: "Select category",
                        label: "Category",
                        onChange: (newVal) => setBudgetCategory(newVal),
                        categories: categoryQuery.data?.categories
                            ? categoryQuery.data.categories
                            : [],
                    },
                    type: {
                        value$: budgetType,
                        onChange: (e) =>
                            setBudgetType(
                                e.target.value as "income" | "expense",
                            ),
                    },
                }}
            />
            <Button
                onClick={openModal}
                variant="soft"
                sx={{
                    position: "fixed",
                    right: "2.5rem",
                    bottom: "2.5rem",
                    width: {
                        xs: "4rem",
                        md: "5rem",
                    },
                    height: {
                        xs: "4rem",
                        md: "5rem",
                    },
                    borderRadius: "0.75rem",
                }}
            >
                <Plus />
            </Button>
        </div>
    );
};

export default BudgetList;
