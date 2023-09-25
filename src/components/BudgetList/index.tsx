"use client";
import React, { useState, useEffect } from "react";
import { Budget, ButtonChangeHandler, Category, NewBudget } from "../types";
import {
    Button,
    DialogTitle,
    RadioGroup,
    Box,
    Select,
    Option,
    IconButton,
} from "@mui/joy";
import Radio, { radioClasses } from "@mui/joy/Radio";
import { Plus, XCircle } from "lucide-react";
import BaseModal from "../BaseModal";
import FormWrapper from "../FormWrapper";
import InputWrapper from "../InputWrapper";
import { getDateString } from "../utils";
import { fetch } from "../utils/Fetch";
import useStore from "../stores";
import {
    API_ADD_BUDGET,
    API_GET_ALL_BUDGETS,
    API_GET_ALL_CATEGORY,
} from "../constants";
import { useSnackbar } from "notistack";
import { NumericFormat } from "react-number-format";
import { getJWTCookie } from "../../../app/actions";
import Unauthorized from "../utils/Unauthorized";
import { useQueryClient, useQuery, useMutation } from "react-query";
import Loading from "@/loading";
import { AxiosError } from "axios";
import LoadingBar from "../LoadingBar";

declare module "react-query" {
    interface Register {
        defaultError: AxiosError;
    }
}

const NumericFormatAdapter = React.forwardRef(function NumericFormatAdapter(
    props: { name: string; onChange: (arg0: object) => void },
    ref,
) {
    const { onChange, ...other } = props;

    return (
        <NumericFormat
            allowNegative={false}
            {...other}
            getInputRef={ref}
            onValueChange={(values) => {
                onChange({
                    target: {
                        name: props.name,
                        value: values.value,
                    },
                });
            }}
            thousandSeparator
            valueIsNumericString
            prefix="₵ "
        />
    );
});

const BudgetList = () => {
    const { enqueueSnackbar } = useSnackbar();

    const user = useStore((state) => state.user);
    const updateUserCategories = useStore(
        (state) => state.updateUserCategories,
    );
    const updateUserBudgets = useStore((state) => state.updateUserBudgets);
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

    const action = React.useRef<null | { focusVisible(): void }>(null);

    const queryClient = useQueryClient();

    const budgetQuery = useQuery({
        queryKey: ["budgets"],
        queryFn: async () => {
            const token = await getJWTCookie("token");
            const res = await fetch.get<{ budgets: Budget[] }>(
                `${API_GET_ALL_BUDGETS}${user.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token?.value}`,
                    },
                },
            );
            return res.data;
        },
        onError: (err) => {
            setAuth(false);

            let err_msg = "";
            if (err instanceof AxiosError) {
                err_msg = err.response?.data.msg;
            } else {
                err_msg = (err as Error).message;
            }

            enqueueSnackbar(`Failed to get budgets: ${err_msg}`, {
                variant: "error",
            });
        },
    });

    const categoryQuery = useQuery({
        queryKey: "categories",
        queryFn: async () => {
            const token = await getJWTCookie("token");
            const res = await fetch.get<{ categories: Category[] }>(
                `${API_GET_ALL_CATEGORY}${user.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token?.value}`,
                    },
                },
            );
            return res.data;
        },

        onError: (err) => {
            setAuth(false);

            let err_msg = "";
            if (err instanceof AxiosError) {
                err_msg = err.response?.data.msg;
            } else {
                err_msg = (err as Error).message;
            }

            enqueueSnackbar(`Failed to get budgets: ${err_msg}`, {
                variant: "error",
            });
        },
    });

    const budgetMutation = useMutation(
        async (budget: NewBudget) => {
            const token = await getJWTCookie("token");

            const res = await fetch.post<{ msg: string }>(
                `${API_ADD_BUDGET}${user.id}`,
                budget,
                {
                    headers: {
                        Authorization: `Bearer ${token?.value}`,
                    },
                },
            );
            return res;
        },
        {
            onSuccess: async (res) => {
                const msg =
                    res.data.msg !== null
                        ? res.data.msg
                        : "Budget added successfully";
                enqueueSnackbar(msg, { variant: "success" });
                resetBudget();
                setOpen(false);
                await queryClient.invalidateQueries("budgets");
            },
            onError: async (err) => {
                let msg = "";
                if (err instanceof AxiosError) {
                    msg = err.response?.data.msg;
                } else {
                    msg = (err as Error).message;
                }
                enqueueSnackbar(`Failed to add budget: ${msg}`, {
                    variant: "error",
                });
            },
        },
    );

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

        return budget;
    };

    const onAddBudget: ButtonChangeHandler = (e) => {
        e.preventDefault();
        budgetMutation.mutate(generateBudget());
    };

    // if (error != null) {
    //     if (error.message == "Unauthorized") return <Unauthorized />;
    //
    //     return (
    //         <div className="flex flex-col justify-center items-center my-52 h-full text-center">
    //             <h1 className="min-w-max text-2xl font-bold sm:text-3xl">
    //                 Something went wrong
    //             </h1>
    //             <p> {error.message}</p>
    //         </div>
    //     );
    // }

    if (budgetQuery.isLoading) return <LoadingBar />;

    if (budgetQuery.isError && budgetQuery.error != null) {
        if (
            budgetQuery.error instanceof AxiosError &&
            budgetQuery.error.message == "Unauthorized"
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

    return (
        <div>
            {budgetQuery.data?.budgets != null &&
            budgetQuery.data?.budgets.length != 0 ? (
                budgetQuery.data?.budgets.map((budget) => {
                    const { id, name, dateAdded } = budget;
                    let { amount } = budget;
                    amount = Number(Number(budget.amount).toFixed(2));
                    return (
                        <div className="flex flex-row justify-between" key={id}>
                            <h1>{name}</h1>
                            <p>{amount}</p>
                            <p>{dateAdded.toString()}</p>
                            <Button>Edit</Button>
                            <Button>Delete</Button>
                        </div>
                    );
                })
            ) : (
                <div className="flex flex-col justify-center items-center my-52 h-full text-center">
                    <h1 className="min-w-max text-2xl font-bold text-gray-500 sm:text-3xl">
                        No budgets yet
                    </h1>
                </div>
            )}
            <BaseModal open={open} onClose={closeModal}>
                <DialogTitle>Add Budget</DialogTitle>
                <FormWrapper onSubmit={onAddBudget}>
                    <InputWrapper
                        label="Name"
                        placeholder="Enter budget name"
                        labelClassName="text-sm"
                        muiOptions={{
                            required: true,
                        }}
                        value$={budgetName}
                        onChange={(e) => setBudgetName(e.target.value)}
                    />
                    <InputWrapper
                        label="Amount"
                        placeholder="Enter budget amount"
                        muiOptions={{
                            required: true,
                            slotProps: {
                                input: {
                                    component: NumericFormatAdapter,
                                },
                            },
                        }}
                        labelClassName="text-sm"
                        value$={budgetAmount}
                        onChange={(e) => setBudgetAmount(e.target.value)}
                    />
                    <InputWrapper
                        label="Date Added"
                        type="date"
                        muiOptions={{
                            required: true,
                        }}
                        placeholder="Enter budget date added"
                        labelClassName="text-sm"
                        value$={budgetDateAdded}
                        onChange={(e) => setBudgetDateAdded(e.target.value)}
                    />
                    <Select
                        action={action}
                        placeholder="Budget category"
                        value={budgetCategory}
                        required
                        onChange={(_e, newVal) => setBudgetCategory(newVal)}
                        {...(budgetCategory != null && {
                            endDecorator: (
                                <IconButton
                                    size="sm"
                                    variant="plain"
                                    color="neutral"
                                    onMouseDown={(event) => {
                                        // don't open the popup when clicking on this button
                                        event.stopPropagation();
                                    }}
                                    onClick={() => {
                                        setBudgetCategory(null);
                                        action.current?.focusVisible();
                                    }}
                                >
                                    <XCircle />
                                </IconButton>
                            ),
                            indicator: null,
                        })}
                        sx={{ minWidth: 160 }}
                    >
                        {categoryQuery.data?.categories.length != 0 ? (
                            categoryQuery.data?.categories.map((category) => (
                                <Option
                                    key={category.categoryId}
                                    value={category.categoryId}
                                >
                                    {category.name}
                                </Option>
                            ))
                        ) : (
                            <Option value={0}>Misc</Option>
                        )}
                    </Select>
                    <RadioGroup
                        name="budget-type"
                        value={budgetType}
                        className="w-full"
                        onChange={(e) =>
                            setBudgetType(
                                e.target.value as "income" | "expense",
                            )
                        }
                        orientation="horizontal"
                    >
                        {["income", "expense"].map((type, key) => (
                            <Box
                                sx={(theme) => ({
                                    position: "relative",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    width: "50%",
                                    height: "3rem",
                                    "&:not([data-first-child])": {
                                        borderLeft: "1px solid",
                                        borderColor: "divider",
                                    },
                                    [`&[data-first-child] .${radioClasses.action}`]:
                                        {
                                            borderTopLeftRadius: `calc(${theme.vars.radius.sm} - 1px)`,
                                            borderBottomLeftRadius: `calc(${theme.vars.radius.sm} - 1px)`,
                                        },
                                    [`&[data-last-child] .${radioClasses.action}`]:
                                        {
                                            borderTopRightRadius: `calc(${theme.vars.radius.sm} - 1px)`,
                                            borderBottomRightRadius: `calc(${theme.vars.radius.sm} - 1px)`,
                                        },
                                })}
                                key={key}
                            >
                                <Radio
                                    value={type}
                                    overlay
                                    disableIcon
                                    label={
                                        {
                                            income: "Income",
                                            expense: "Expense",
                                        }[type]
                                    }
                                    variant={
                                        budgetType === type ? "solid" : "plain"
                                    }
                                    slotProps={{
                                        input: { "aria-label": type },
                                        action: {
                                            sx: {
                                                borderRadius: 0,
                                                transition: "none",
                                            },
                                        },
                                        label: { sx: { lineHeight: 0 } },
                                    }}
                                />
                            </Box>
                        ))}
                    </RadioGroup>
                    <Button className="text-xl" type="submit">
                        Add
                    </Button>
                </FormWrapper>
            </BaseModal>
            <Button
                onClick={openModal}
                variant="outlined"
                sx={{
                    position: "fixed",
                    right: "2.5rem",
                    bottom: "2.5rem",
                    width: "5rem",
                    height: "5rem",
                    borderRadius: "0.75rem",
                }}
            >
                <Plus />
            </Button>
        </div>
    );
};

export default BudgetList;
