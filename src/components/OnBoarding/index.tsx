"use client";
import { Box, Button, Chip, Stack } from "@mui/joy";
import React, { useEffect, useState } from "react";
import PageLink from "../PageLink";
import FormWrapper from "../FormWrapper";
import {
    ButtonChangeHandler,
    Category,
    NewCategory,
    NewUserBudgetOptions,
    User,
} from "../types";
import InputWrapper from "../InputWrapper";
import { useSnackbar } from "notistack";
import { HexColorInput, HexColorPicker } from "react-colorful";
import { Plus } from "lucide-react";
import { fetch } from "../utils/Fetch";
import {
    API_CREATE_BUDGET_OPTIONS,
    API_USER_CREATED_TEMPLATE,
} from "../constants";
import { getJWTCookie } from "@/actions";
import useStore from "../stores";
import NumericFormatAdapter from "../NumericFormatAdapter";
import { useRouter } from "next/navigation";

const OnBoarding = ({ id }: { id: string }) => {
    const user = useStore((state) => state.user);
    const router = useRouter();

    const { enqueueSnackbar } = useSnackbar();
    const [categoriesWithWeights, setCategoriesWithWeights] = useState<
        { category: NewCategory; weight: number }[]
    >([]);
    const [income, setIncome] = useState(0);

    const [categoryName, setCategoryName] = useState("");
    const [categoryColor, setCategoryColor] = useState("#000000");
    const [categoryWeight, setCategoryWeight] = useState(0);

    const [totalWeight, setTotalWeight] = useState(categoryWeight);
    const [loading, setLoading] = useState(false);

    const addCategoryAndWeight = (category: NewCategory, weight: number) => {
        setCategoriesWithWeights([
            ...categoriesWithWeights,
            { category, weight },
        ]);
        setCategoryName("");
        setCategoryColor("#000000");
        setCategoryWeight(0);
    };

    const resetState = () => {
        setCategoriesWithWeights([]);
        setIncome(0);
        setCategoryName("");
        setCategoryColor("#000000");
        setCategoryWeight(0);
    };

    const calculateTotalWeight = () => {
        setTotalWeight(
            categoriesWithWeights.reduce(
                (acc, item) => acc + item.weight,
                categoryWeight,
            ),
        );
    };

    useEffect(() => {
        calculateTotalWeight();
    }, [categoriesWithWeights, categoryWeight]);

    const onAddCategoryAndWeight: ButtonChangeHandler = (e) => {
        e.preventDefault();

        if (totalWeight > 100) {
            enqueueSnackbar("Cannot add more categories with current weights", {
                variant: "error",
            });
        } else {
            addCategoryAndWeight(generateCategory(), categoryWeight);
        }
    };

    const generateCategory = () => {
        const category: NewCategory = {
            name: categoryName,
            color: categoryColor,
        };
        setCategoryName("");
        setCategoryColor("#000000");
        return category;
    };

    const onConfirmed = async (userBudgetOptions: NewUserBudgetOptions) => {
        const token = await getJWTCookie("token");
        fetch
            .post<{ msg: string }>(
                `${API_CREATE_BUDGET_OPTIONS}${id}`,
                userBudgetOptions,
                {
                    headers: {
                        Authorization: `Bearer ${token?.value}`,
                    },
                },
            )
            .then(async (res) => {
                enqueueSnackbar(res.data.msg, {
                    variant: "success",
                });
                const token = await getJWTCookie("token");
                fetch
                    .put<{ msg: string }>(
                        `${API_USER_CREATED_TEMPLATE}${id}`,
                        {},
                        {
                            headers: {
                                Authorization: `Bearer ${token?.value}`,
                            },
                        },
                    )
                    .then((res) => {
                        setLoading(false);
                        enqueueSnackbar(res.data.msg, {
                            variant: "success",
                        });
                        resetState();
                        router.prefetch(`/home/${id}/budget/home`);
                        router.replace(`/home/${id}/budget/home`);
                    })
                    .catch((err) => {
                        enqueueSnackbar("Something went wrong", {
                            variant: "error",
                        });
                        console.log(err);
                    });
            })
            .catch((err) => {
                enqueueSnackbar("Something went wrong", {
                    variant: "error",
                });
                console.log(err);
            });
    };

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    const onProceed: ButtonChangeHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (totalWeight !== 100) {
            enqueueSnackbar("Total weight must be 100%", {
                variant: "error",
            });
            setLoading(false);
            return;
        }

        if (income === 0) {
            enqueueSnackbar("Income cannot be 0", {
                variant: "error",
            });
            return;
        }

        const userBudgetOptions: NewUserBudgetOptions = {
            userId: id,
            budgetOptions: {
                income: income,
                options: [
                    ...categoriesWithWeights.map((item) => ({
                        category: {
                            ...item.category,
                        },
                        weight: item.weight,
                    })),
                ],
            },
        };
        onConfirmed(userBudgetOptions).catch((err) => {
            setLoading(false);
            console.log(err);
        });
    };

    return (
        <div className="flex flex-col items-center space-y-5 onboarding">
            <div className="flex flex-col justify-center items-center self-center max-w-5xl min-w-[35vw]">
                <Box sx={{ maxWidth: "inherit", minWidth: "inherit" }}>
                    <Stack spacing={3}>
                        <InputWrapper
                            label="Your monthly income"
                            value$={income}
                            placeholder="4000"
                            muiOptions={{
                                required: true,
                                slotProps: {
                                    input: { component: NumericFormatAdapter },
                                },
                            }}
                            onChange={(e) =>
                                setIncome(parseInt(e.target.value))
                            }
                            labelClassName="text-xl"
                        />
                        {categoriesWithWeights.length !== 0 ? (
                            categoriesWithWeights.map(
                                (categoryWithWeight, key) => (
                                    <div
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setCategoriesWithWeights(
                                                categoriesWithWeights.filter(
                                                    (category) =>
                                                        category.category !==
                                                        categoryWithWeight.category,
                                                ),
                                            );
                                        }}
                                        key={key}
                                        className="flex flex-row justify-between hover:cursor-pointer"
                                    >
                                        <Chip
                                            variant="soft"
                                            sx={{
                                                backgroundColor:
                                                    categoryWithWeight.category
                                                        .color,
                                                fontSize: "1.25rem",
                                                lineHeight: "1.75rem",
                                            }}
                                            className="text-xl"
                                        >
                                            {categoryWithWeight.category.name}
                                        </Chip>
                                        <p className="text-xl">
                                            {categoryWithWeight.weight}%
                                        </p>
                                    </div>
                                ),
                            )
                        ) : (
                            <div className="flex flex-col justify-center items-center my-52 h-full text-center">
                                <h1 className="min-w-max text-2xl font-bold text-gray-500 sm:text-3xl">
                                    Add some categories
                                </h1>
                            </div>
                        )}
                    </Stack>
                </Box>
            </div>
            <div className="p-5 bg-[#141617]/20 rounded-md">
                <FormWrapper onSubmit={onAddCategoryAndWeight}>
                    <InputWrapper
                        value$={categoryName}
                        placeholder="Groceries"
                        onChange={(e) => setCategoryName(e.target.value)}
                        muiOptions={{ required: true }}
                        label="Category Name"
                        labelClassName="text-xl"
                    />
                    <InputWrapper
                        value$={categoryWeight}
                        placeholder=""
                        onChange={(e) =>
                            setCategoryWeight(parseInt(e.target.value))
                        }
                        muiOptions={{ required: true }}
                        type="number"
                        label="Category weight"
                        labelClassName="text-xl"
                    />
                    <HexColorPicker
                        color={categoryColor}
                        onChange={(c) => setCategoryColor(c)}
                    />
                    <Button type="submit">
                        <Plus />
                    </Button>
                </FormWrapper>
            </div>
            <Button
                className="text-xl min-w-[35vw]"
                sx={{
                    fontSize: "1.25rem",
                    lineHeight: "1.75rem",
                }}
                onClick={onProceed}
                loading={loading}
            >
                Proceed
            </Button>
        </div>
    );
};

export default OnBoarding;
