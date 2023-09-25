import React, { useState } from "react";
import { Budget, ButtonChangeHandler, Category, NewBudget } from "../types";
import { Button } from "@mui/joy";
import { getDateString } from "../utils";
import BudgetModal from "../BudgetModal";
import { UseMutationResult } from "react-query";
import { AxiosResponse } from "axios";

interface BudgetSingleProps {
    // budget: {
    //     name: string;
    //     id: string;
    //     userId: string;
    //     dateAdded: string;
    //     amount: number;
    //     categoryId: number;
    // };
    budget: Budget;
    categories: Category[];
    editMutation: UseMutationResult<
        AxiosResponse<{ msg: string }>,
        unknown,
        { budget: NewBudget; id: string },
        unknown
    >;
    deleteMutation: UseMutationResult<
        AxiosResponse<{ msg: string }>,
        unknown,
        string,
        unknown
    >;
}

const BudgetSingle = ({
    budget,
    categories,
    editMutation,
    deleteMutation,
}: BudgetSingleProps) => {
    const { name, id, categoryId, dateAdded, userId } = budget;
    let { amount } = budget;
    amount = Number(Number(budget.amount).toFixed(2));

    const [open, setOpen] = useState<boolean>(false);

    const [budgetName, setBudgetName] = useState<string>(name);
    const [budgetAmount, setBudgetAmount] = useState<string>(amount.toString());
    const [budgetDateAdded, setBudgetDateAdded] = useState<string>(
        getDateString(dateAdded),
    );
    const [budgetCategory, setBudgetCategory] = useState<number | null>(
        categoryId,
    );
    const [budgetType, setBudgetType] = useState<"income" | "expense">(
        amount < 0 ? "expense" : "income",
    );

    const resetBudget = () => {
        setBudgetName(name);
        setBudgetAmount(amount.toString());
        setBudgetDateAdded(getDateString(dateAdded));
        setBudgetCategory(categoryId);
        setBudgetType(budgetType);
    };

    const generateBudget = () => {
        const budget: NewBudget = {
            name: budgetName,
            userId: userId,
            amount:
                budgetType === "income"
                    ? Math.abs(Number(budgetAmount))
                    : -Math.abs(Number(budgetAmount)),

            dateAdded: new Date(budgetDateAdded),
            categoryId: budgetCategory!,
        };

        return budget;
    };

    const onEditBudget: ButtonChangeHandler = (e) => {
        e.preventDefault();
        editMutation.mutate({ budget: generateBudget(), id: id });
        setOpen(false);
    };

    const onDeleteBudget: ButtonChangeHandler = (e) => {
        e.preventDefault();
        deleteMutation.mutate(id);
    };

    const openModal: ButtonChangeHandler = (e) => {
        e.preventDefault();
        setOpen(true);
    };

    const closeModal: ButtonChangeHandler = (e) => {
        e.preventDefault();
        resetBudget();
        setOpen(false);
    };

    return (
        <>
            <div className="flex flex-row justify-between">
                <div className="flex flex-col items-center [&>*]:py-2">
                    <h1 className="text-xl sm:text-3xl">{name}</h1>
                    <p>
                        {dateAdded.toLocaleDateString(undefined, {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                        })}
                    </p>
                </div>
                <div className="flex flex-col items-end [&>*]:py-2">
                    <p className="text-xl">₵ {amount.toFixed(2)}</p>
                    <div className="flex flex-row justify-between w-40">
                        <Button variant="outlined" onClick={openModal}>
                            Edit
                        </Button>
                        <Button variant="outlined" onClick={onDeleteBudget}>
                            Delete
                        </Button>
                    </div>
                </div>
            </div>

            <BudgetModal
                open={open}
                onClose={closeModal}
                onSubmit={onEditBudget}
                buttonText="Edit"
                options={{
                    modalTitle: "Edit Record",
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
                        categories: categories,
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
        </>
    );
};

export default BudgetSingle;
