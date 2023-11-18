"use client";
import React, { useState, useEffect, MouseEventHandler } from "react";
import {
    BudgetOptions,
    ButtonChangeHandler,
    Category,
    NewUserBudgetOptions,
    User,
} from "../types";
import InputWrapper from "../InputWrapper";
import {
    Button,
    DialogTitle,
    FormControl,
    FormLabel,
    Input,
    Stack,
} from "@mui/joy";
import TemplateCategory from "../TemplateCategory";
import NumericFormatAdapter from "../NumericFormatAdapter";
import { useModal } from "react-modal-hook";
import BaseModal from "../BaseModal";
import { UseMutationResult } from "react-query/types/react/types";
import { AxiosResponse } from "axios";
import useStore from "../stores";
import { useSnackbar } from "notistack";

interface TemplateViewProps {
    disabled: boolean;
    income: number;
    categories: Category[];
    editMutation: UseMutationResult<
        AxiosResponse<{
            msg: string;
        }>,
        unknown,
        {
            user: User;
            newUserBudget: Partial<NewUserBudgetOptions>;
        },
        unknown
    >;
}

const TemplateView = ({
    disabled,
    income,
    categories,
    editMutation,
}: TemplateViewProps) => {
    const user = useStore((state) => state.user);
    const { enqueueSnackbar } = useSnackbar();

    const [isDisabled, setDisabled] = useState<boolean>(disabled);
    const [incomeState, setIncomeState] = useState<number>(income);
    const [showModal, hideModal] = useModal(() => (
        <BaseModal open={true} onClose={hideModal}>
            <DialogTitle>Save Changes?</DialogTitle>
            <h2 className="text-xl">This action cannot be undone</h2>
            <div className="flex justify-between width-full">
                <Button
                    sx={{
                        width: "100%",
                        fontSize: "1.5rem",
                        borderRadius: "0",
                        fontWeight: "600",
                    }}
                    onClick={onProceed}
                >
                    Proceed
                </Button>
                <Button
                    sx={{
                        width: "100%",
                        fontSize: "1.5rem",
                        borderRadius: "0",
                        fontWeight: "600",
                    }}
                    color="danger"
                    onClick={(_e) => {
                        hideModal();
                    }}
                >
                    Cancel
                </Button>
            </div>
        </BaseModal>
    ));

    let total = 0;
    categories.forEach((cat) => {
        total += parseFloat(cat.weight);
    });

    const generateBudgetOption = () => {
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
        console.log({ incomeState });

        const newBudgetOptions: Partial<BudgetOptions> = {
            userId: user.id!,
            budgetOptions: {
                income: incomeState,
                options: options,
            },
        };
        console.log({ newBudgetOptions });
        return newBudgetOptions;
    };

    const onCancel: ButtonChangeHandler = (e) => {
        e.preventDefault();
        setDisabled(true);
        setIncomeState(income);
    };

    useEffect(() => {
        setIncomeState(income);
    }, []);

    useEffect(() => {
        setIncomeState(income);
    }, [income]);

    const onSave: ButtonChangeHandler = (e) => {
        e.preventDefault();
        showModal();
    };

    const onProceed: ButtonChangeHandler = () => {
        editMutation
            .mutateAsync({
                user: user,
                newUserBudget: generateBudgetOption(),
            })
            .then((res) => {
                enqueueSnackbar(res.data.msg, {
                    variant: "success",
                });
                setDisabled(true);
                hideModal();
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <div className="bg-[#141617]/20 flex min-w-[80vw] rounded-xl max-w-5xl justify-center flex-col items-center p-4">
            <InputWrapper
                muiOptions={{
                    required: true,
                    slotProps: {
                        input: {
                            component: NumericFormatAdapter,
                        },
                    },
                }}
                labelClassName="text-xl"
                value$={incomeState}
                onChange={(e) => setIncomeState(parseFloat(e.target.value))}
                label="Income"
                placeholder="1000"
                disabled={isDisabled}
            />
            <div className="flex flex-col my-5 space-y-5 w-full">
                {categories.map((category, key) => (
                    <div
                        key={key}
                        className="flex flex-row flex-auto justify-between"
                    >
                        <TemplateCategory
                            income={income}
                            name={category.name}
                            color={category.color}
                            weight={parseFloat(category.weight)}
                        />
                    </div>
                ))}
                {total != 100 ? (
                    <div className="flex flex-row flex-auto justify-between">
                        <TemplateCategory
                            income={income}
                            name="Unaccounted"
                            color="#000"
                            weight={100 - total}
                        />
                    </div>
                ) : (
                    <></>
                )}
            </div>
            {isDisabled ? (
                <Button
                    onClick={(_e) => setDisabled(false)}
                    sx={{ width: "100%", fontSize: "1.5rem" }}
                >
                    Edit
                </Button>
            ) : (
                <div className="flex flex-col space-y-3 w-full">
                    <Button
                        onClick={onSave}
                        sx={{ width: "100%", fontSize: "1.5rem" }}
                    >
                        Save
                    </Button>
                    <Button
                        color="danger"
                        onClick={onCancel}
                        sx={{ width: "100%", fontSize: "1.5rem" }}
                    >
                        Cancel
                    </Button>
                </div>
            )}
        </div>
    );
};

export default TemplateView;
