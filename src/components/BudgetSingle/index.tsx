import React, { MouseEventHandler, useEffect, useState } from "react";
import { Budget, ButtonChangeHandler, Category, NewBudget } from "../types";
import {
    Button,
    Chip,
    Dropdown,
    IconButton,
    Menu,
    MenuButton,
    MenuItem,
} from "@mui/joy";
import { getDateString } from "../utils";
import BudgetModal from "../BudgetModal";
import { UseMutationResult } from "react-query";
import { AxiosResponse } from "axios";
import { NumericFormat } from "react-number-format";
import { MenuSquare } from "lucide-react";

interface BudgetSingleProps {
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
    const [budgetCategoryId, setBudgetCategoryId] = useState<number | null>(
        categoryId,
    );
    const [budgetType, setBudgetType] = useState<"income" | "expense">(
        amount < 0 ? "expense" : "income",
    );

    const getBudgetCategory = (id: number | null) => {
        if (id == null) return null;
        if (categories.length !== 0)
            return categories.filter(
                (category) => category.categoryId === id,
            )[0];
        return null;
    };

    const [budgetCategory, setBudgetCategory] = useState<Category | null>(
        getBudgetCategory(budgetCategoryId),
    );

    useEffect(() => {
        setBudgetCategory(getBudgetCategory(budgetCategoryId));
    }, [categoryId, categories]);

    const resetBudget = () => {
        setBudgetName(name);
        setBudgetAmount(amount.toString());
        setBudgetDateAdded(getDateString(dateAdded));
        setBudgetCategoryId(categoryId);
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
            categoryId: budgetCategoryId!,
        };

        return budget;
    };

    const onEditBudget: ButtonChangeHandler = (e) => {
        e.preventDefault();
        const budget = generateBudget();
        editMutation
            .mutateAsync({ budget: budget, id: id })
            .then((_res) => {
                setOpen(false);
                setBudgetCategory(getBudgetCategory(budget.categoryId));
            })
            .catch((err) => {
                console.log({ err });
            });
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
            <div className="flex flex-row justify-between w-full sm:w-[75vw]">
                <div className="flex w-max px-2 sm:px-5 flex-col items-center [&>*]:py-2">
                    <h1 className="text-lg sm:text-3xl">{name}</h1>
                    <div className="flex flex-row space-x-4 sm:space-x-10">
                        <p>
                            {dateAdded.toLocaleDateString(undefined, {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                            })}
                        </p>
                        <Chip
                            variant="soft"
                            sx={{
                                backgroundColor:
                                    budgetCategory?.color || "#000",
                            }}
                        >
                            {budgetCategory?.name || "Uncategorized"}
                        </Chip>
                    </div>
                </div>
                <div className="flex flex-col items-end [&>*]:py-2">
                    <NumericFormat
                        className="text-lg sm:text-2xl"
                        value={amount.toFixed(2)}
                        displayType="text"
                        thousandSeparator={true}
                        // prefix="₵ "
                        prefix="$ "
                    />
                    <div className="hidden flex-row justify-between space-x-2 w-40 sm:flex sm:space-x-5">
                        <Button variant="outlined" onClick={openModal}>
                            Edit
                        </Button>
                        <Button
                            variant="outlined"
                            loading={deleteMutation.isLoading}
                            onClick={onDeleteBudget}
                        >
                            Delete
                        </Button>
                    </div>
                    <div className="block self-center sm:hidden">
                        <Dropdown>
                            <MenuButton
                                slots={{ root: IconButton }}
                                slotProps={{
                                    root: {
                                        variant: "",
                                        color: "plain",
                                    },
                                }}
                                size="sm"
                            >
                                <MenuSquare />
                            </MenuButton>
                            <Menu id="options" keepMounted>
                                <MenuItem
                                    onClick={openModal as MouseEventHandler}
                                >
                                    Edit
                                </MenuItem>
                                <MenuItem
                                    onClick={
                                        onDeleteBudget as MouseEventHandler
                                    }
                                >
                                    Delete
                                </MenuItem>
                            </Menu>
                        </Dropdown>
                    </div>
                </div>
            </div>

            <BudgetModal
                open={open}
                onClose={closeModal}
                onSubmit={onEditBudget}
                buttonText="Edit"
                buttonLoading={editMutation.isLoading}
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
                        value$: budgetCategoryId,
                        placeholder: "Select category",
                        label: "Category",
                        onChange: (newVal) => {
                            setBudgetCategoryId(newVal);
                        },
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
