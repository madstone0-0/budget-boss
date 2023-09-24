"use client";
import React, { useState, useEffect } from "react";
import { Budget, ButtonChangeHandler, Category, NewBudget } from "../types";
import {
    Button,
    DialogTitle,
    RadioGroup,
    Stack,
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
    const [budgetDateUpdated, setBudgetDateUpdated] = useState<Date>(
        new Date(Date.now()),
    );
    const [budgetCategory, setBudgetCategory] = useState<number | null>(null);
    const [budgetType, setBudgetType] = useState<"income" | "expense">(
        "income",
    );
    const [error, setError] = useState<Error | null>(null);

    const action = React.useRef<null | { focusVisible(): void }>(null);

    const refreshBudgets = async () => {
        const token = await getJWTCookie("token");
        const abortContoller = new AbortController();
        let signal = abortContoller.signal;
        fetch
            .get<{ budgets: Budget[] }>(`${API_GET_ALL_BUDGETS}${user.id}`, {
                signal: signal,
                headers: {
                    Authorization: `Bearer ${token?.value}`,
                },
            })
            .then((res) => {
                const budgets = res.data.budgets;
                updateUserBudgets(budgets);
            })
            .catch((err) => {
                setAuth(false);
                const err_msg =
                    err.response?.data.msg !== null
                        ? err.response.data.msg
                        : err.message;
                enqueueSnackbar(`Failed to get budgets: ${err_msg}`, {
                    variant: "error",
                });
                setError(err as Error);
            });
        return abortContoller;
    };

    const refreshCategories = async () => {
        const token = await getJWTCookie("token");
        const abortContoller = new AbortController();
        let signal = abortContoller.signal;
        fetch
            .get<{ categories: Category[] }>(
                `${API_GET_ALL_CATEGORY}${user.id}`,
                {
                    signal: signal,
                    headers: {
                        Authorization: `Bearer ${token?.value}`,
                    },
                },
            )
            .then((res) => {
                const categories = res.data.categories;
                updateUserCategories(categories);
            })
            .catch((err) => {
                setAuth(false);
                const err_msg =
                    err.response.data.msg !== null
                        ? err.response.data.msg
                        : err.message;
                enqueueSnackbar(`Falied to get categories: ${err_msg}`, {
                    variant: "error",
                });
                setError(err as Error);
            });
        return abortContoller;
    };

    useEffect(() => {
        const refreshBudgetsController = refreshBudgets();
        const refreshCategoriesController = refreshCategories();
        return () => {
            refreshBudgetsController
                .then((res) => {
                    res.abort();
                })
                .catch((err) => console.log({ err }));
            refreshCategoriesController
                .then((res) => {
                    res.abort();
                })
                .catch((err) => console.log({ err }));
        };
    }, []);

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
        getJWTCookie("token")
            .then((token) => {
                const budget = generateBudget();
                fetch
                    .post<{ msg: string }>(
                        `${API_ADD_BUDGET}${user.id}`,
                        budget,
                        {
                            headers: {
                                Authorization: `Bearer ${token?.value}`,
                            },
                        },
                    )
                    .then(async (res) => {
                        const msg =
                            res.data.msg !== null
                                ? res.data.msg
                                : "Budget added successfully";
                        enqueueSnackbar(msg, { variant: "success" });
                        resetBudget();
                        await refreshBudgets();
                        setOpen(false);
                    })
                    .catch((err) => {
                        const msg =
                            err.response.data.msg !== null
                                ? err.response.data.msg
                                : err.message;
                        enqueueSnackbar(`Failed to add budget: ${msg}`, {
                            variant: "error",
                        });
                    });
            })
            .catch((err) => {
                const msg =
                    err.response.data.msg !== null
                        ? err.response.data.msg
                        : err.message;
                enqueueSnackbar(`Failed to add budget: ${msg}`, {
                    variant: "error",
                });
            });
    };

    if (error != null) {
        if (error.message == "Unauthorized") return <Unauthorized />;

        return (
            <div className="flex flex-col justify-center items-center my-52 h-full text-center">
                <h1 className="min-w-max text-2xl font-bold sm:text-3xl">
                    Something went wrong
                </h1>
                <p> {error.message}</p>
            </div>
        );
    }

    return (
        <div>
            {user.budgets != null && user.budgets.length != 0 ? (
                user.budgets.map((budget) => {
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
                        {user.categories.length != 0 ? (
                            user.categories.map((category) => (
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
                className="fixed right-10 bottom-10 w-20 h-20 rounded-xl"
            >
                <Plus />
            </Button>
        </div>
    );
};

export default BudgetList;
