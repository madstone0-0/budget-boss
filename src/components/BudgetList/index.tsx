"use client";
import React, { useState, useEffect } from "react";
import {
    Budget,
    ButtonChangeHandler,
    Category,
    NewBudget,
    NewCategory,
    CategoryTotal,
} from "../types";
import { Alert, Button } from "@mui/joy";
import { AlertCircle, MailWarning, Plus } from "lucide-react";
import { getDateString, useCurrencyFormatter } from "../utils";
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
import {
    useQueryClient,
    useQuery,
    useMutation,
    QueryKey,
    UseQueryResult,
} from "react-query";
import { AxiosError, AxiosResponse } from "axios";
import LoadingBar from "../LoadingBar";
import BudgetModal from "../BudgetModal";
import BudgetSingle from "../BudgetSingle";
import BudgetPie from "../BudgetPie";
import { Input } from "@mui/joy";
import useQueriesAndMutations, { doOnError } from "../utils/queries";
import { getBudgetTotal } from "../utils/api";
import { stat, truncate } from "fs";
import usePersistantStore from "../stores/persistantStore";

declare module "react-query" {
    interface Register {
        defaultError: AxiosError;
    }
}

const BudgetList = () => {
    const { enqueueSnackbar } = useSnackbar();

    const user = useStore((state) => state.user);

    const { formatter } = useCurrencyFormatter();

    const setAuth = useStore((state) => state.setAuth);
    // const updateCategories = useStore((state) => state.updateCategories);

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

    const [filterDate, setFilterDate] = useState<string | undefined>(
        getDateAndYear(new Date()),
    );

    const { queries, mutations } = useQueriesAndMutations(user);
    const { budgetQuery, categoryQuery, budgetOptionQuery } = queries;
    const {
        budgetAddMutation,
        budgetEditMutation,
        categoryAddMutation,
        budgetDeleteMutation,
        categoryEditMutation,
        categoryDeleteMutation,
    } = mutations;

    const [totals, setTotals] = useState<CategoryTotal[]>([]);

    const generateTotals = async () => {
        const totals: CategoryTotal[] = [];
        if (categoryQuery.data?.categories == undefined) return totals;

        for (const category of categoryQuery.data.categories) {
            const { total } = await getBudgetTotal(
                user.id!,
                category.categoryId,
            );
            totals.push({
                categoryId: category.categoryId,
                total: total ? parseFloat(total) : null,
            });
        }
        console.log({ totals });
        return totals;
    };

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

    useEffect(() => {
        if (budgetQuery.data?.budgets) {
            (async () => {
                const totals = await generateTotals();
                setTotals(totals);
            })().catch((err) => {
                console.log({ err });
            });
        }
    }, []);

    useEffect(() => {
        if (budgetQuery.data?.budgets) {
            (async () => {
                const totals = await generateTotals();
                setTotals(totals);
            })().catch((err) => {
                console.log({ err });
            });
        }
    }, [budgetQuery.data, categoryQuery.data]);

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
            budgetAddMutation
                .mutateAsync({ budget: generateBudget(), user: user })
                .then(async () => {
                    setOpen(false);
                    resetBudget();
                    const totals = await generateTotals();
                    setTotals(totals);
                })
                .catch((err) => {
                    doOnError(err, (msg) =>
                        enqueueSnackbar(`Failed to add budget: ${msg}`, {
                            variant: "error",
                        }),
                    );
                });
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
            <div className="self-center flex space-y-5 flex-col sm:w-[40%]">
                {categoryQuery.data?.categories.length !== 0 &&
                budgetOptionQuery.data?.budgetOptions ? (
                    categoryQuery.data?.categories.map((category, key) => {
                        let status: "over" | "under" | undefined;
                        let amountExceeded = 0;
                        let percentExceeded = 0;
                        const found = totals.find((total) => {
                            if (total.categoryId == category.categoryId) {
                                const expectedUsage =
                                    (parseFloat(category.weight) / 100) *
                                    budgetOptionQuery.data?.budgetOptions
                                        .budgetOptions.income;

                                if (total.total) {
                                    const isNegative = total.total < 0;
                                    const absTotal = Math.abs(total.total);
                                    const catId = category.categoryId;

                                    console.log({
                                        catId,
                                        expectedUsage,
                                        isNegative,
                                        absTotal,
                                    });
                                }

                                if (
                                    total.total &&
                                    total.total < 0 &&
                                    Math.abs(total.total) > expectedUsage
                                ) {
                                    status = "over";
                                    amountExceeded =
                                        Math.abs(total.total) - expectedUsage;
                                    percentExceeded =
                                        (amountExceeded / expectedUsage) * 100;
                                    return true;
                                }
                            }
                            return false;
                        });
                        // return <></>;
                        if (!status) return <></>;
                        if (!found) return <></>;
                        return (
                            <Alert
                                className="animate-pulse"
                                startDecorator={<AlertCircle />}
                                key={key}
                                color="danger"
                                sx={{
                                    fontSize: {
                                        xs: "0.75rem",
                                        md: "1rem",
                                    },
                                    minWidth: "min-content",
                                }}
                            >
                                {`You have exceeded your ${
                                    category.name
                                } budget by ${percentExceeded.toPrecision(
                                    2,
                                )}% (${formatter.format(amountExceeded)})`}
                            </Alert>
                        );
                    })
                ) : (
                    <></>
                )}
            </div>
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
                    budgetQuery.isFetching ? (
                        <div className="flex flex-col justify-center items-center my-20 h-full text-center">
                            <h1 className="min-w-max text-2xl font-bold text-gray-500 sm:text-3xl">
                                Refreshing...
                            </h1>
                        </div>
                    ) : (
                        filteredBudgets.map((budget) => (
                            <BudgetSingle
                                key={budget.id}
                                budget={budget}
                                setTotals={setTotals}
                                generateTotals={generateTotals}
                                categories={
                                    categoryQuery.data?.categories
                                        ? categoryQuery.data.categories
                                        : []
                                }
                                editMutation={budgetEditMutation}
                                deleteMutation={budgetDeleteMutation}
                            />
                        ))
                    )
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
