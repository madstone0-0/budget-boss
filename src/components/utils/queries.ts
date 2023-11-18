import {
    useQueryClient,
    useQuery,
    useMutation,
    QueryKey,
    Query,
    Mutation,
} from "react-query";
import React from "react";
import { AxiosError } from "axios";
import { useSnackbar } from "notistack";
import {
    deleteBudgets,
    deleteCategories,
    getBudgetOption,
    getBudgetTotal,
    getBudgets,
    getCategories,
    postBudgets,
    postCategories,
    putBudgetOption,
    putBudgets,
    putCategories,
} from "./api";
import { BudgetOptions, Category, User } from "../types";

export const doOnError = (err: unknown, feebackFn: (msg: string) => void) => {
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

const useQueriesAndMutations = (user: User) => {
    const queryClient = useQueryClient();
    const { enqueueSnackbar } = useSnackbar();

    const budgetQuery = useQuery({
        queryKey: "budgets",
        queryFn: () => getBudgets(user),
        onError: (err) =>
            doOnError(err, (msg) =>
                enqueueSnackbar(`Failed to get budgets: ${msg}`, {
                    variant: "error",
                }),
            ),
        staleTime: 5000,
        refetchInterval: 300000,
    });

    const categoryQuery = useQuery({
        queryKey: "categories",
        queryFn: () => getCategories(user),
        onError: (err) =>
            doOnError(err, (msg) =>
                enqueueSnackbar(`Failed to get categories: ${msg}`, {
                    variant: "error",
                }),
            ),
        // onSuccess: (res) => {
        //     updateCategories(res.categories);
        // },
        staleTime: 5000,
        refetchInterval: 300000,
    });

    const budgetOptionQuery = useQuery({
        queryKey: "budgetOptions",
        queryFn: () => getBudgetOption(user),
        onError: (err) =>
            doOnError(err, (msg) =>
                enqueueSnackbar(`Failed to get budget options: ${msg}`, {
                    variant: "error",
                }),
            ),
        staleTime: 5000,
        refetchInterval: 300000,
    });

    const generateBudgetOptionsOnCategoryChange = (
        user: User,
        categories: Category[],
    ) => {
        const income =
            budgetOptionQuery.data?.budgetOptions.budgetOptions.income;
        // const categories = categoryQuery.data?.categories;
        console.log({ categories });
        let options: BudgetOptions["budgetOptions"]["options"] = [];
        categories?.forEach((category) => {
            options.push({
                weight: parseFloat(category.weight),
                category: {
                    name: category.name,
                    color: category.color,
                },
            });
        });
        const newBudgetOptions: Partial<BudgetOptions> = {
            userId: user.id!,
            budgetOptions: {
                income: income!,
                options: options,
            },
        };
        console.log({ newBudgetOptions });
        return newBudgetOptions;
    };

    const budgetAddMutation = useMutation({
        mutationFn: postBudgets,
        onSuccess: async (res) => {
            const msg = res.data.msg;
            enqueueSnackbar(msg, { variant: "success" });
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

    const categoryAddMutation = useMutation({
        mutationFn: postCategories,
        onSuccess: async (res) => {
            const msg = res.data.msg;
            enqueueSnackbar(msg, { variant: "success" });

            await queryClient
                .invalidateQueries({ queryKey: "categories" })
                .then(async () => {
                    const newCategories = await categoryQuery.refetch();
                    budgetOptionEditMutation.mutate({
                        user: user,
                        newUserBudget: generateBudgetOptionsOnCategoryChange(
                            user,
                            newCategories.data?.categories || [],
                        ),
                    });
                });

            await queryClient.invalidateQueries({ queryKey: "budgetOptions" });
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

            await queryClient
                .invalidateQueries({ queryKey: "categories" })
                .then(async () => {
                    const newCategories = await categoryQuery.refetch();
                    budgetOptionEditMutation.mutate({
                        user: user,
                        newUserBudget: generateBudgetOptionsOnCategoryChange(
                            user,
                            newCategories.data?.categories || [],
                        ),
                    });
                });
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

            await queryClient
                .invalidateQueries({ queryKey: "categories" })
                .then(async () => {
                    const newCategories = await categoryQuery.refetch();
                    budgetOptionEditMutation.mutate({
                        user: user,
                        newUserBudget: generateBudgetOptionsOnCategoryChange(
                            user,
                            newCategories.data?.categories || [],
                        ),
                    });
                });

            await queryClient.invalidateQueries({ queryKey: "budgetOptions" });
        },
        onError: (err) =>
            doOnError(err, (msg) => {
                enqueueSnackbar(`Failed to delete category: ${msg}`, {
                    variant: "error",
                });
            }),
    });

    const budgetOptionEditMutation = useMutation({
        mutationFn: putBudgetOption,
        onSuccess: async (res) => {
            const msg = res.data.msg;
            enqueueSnackbar(msg, { variant: "success" });
            await queryClient.invalidateQueries({ queryKey: "budgetOptions" });
        },
        onError: (err) =>
            doOnError(err, (msg) => {
                enqueueSnackbar(`Failed to edit budget option: ${msg}`, {
                    variant: "error",
                });
            }),
    });

    return {
        queries: { budgetQuery, categoryQuery, budgetOptionQuery },
        mutations: {
            budgetAddMutation,
            budgetEditMutation,
            budgetDeleteMutation,
            categoryAddMutation,
            categoryEditMutation,
            categoryDeleteMutation,
            budgetOptionEditMutation,
        },
    };
};
export default useQueriesAndMutations;
