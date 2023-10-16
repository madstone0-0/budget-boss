import React, { useState, useEffect, useReducer } from "react";
import {
    Budget,
    ButtonChangeHandler,
    Category,
    NewCategory,
    Series,
} from "../types";
import { AxiosResponse } from "axios";
import { UseBaseMutationResult } from "react-query";
import { Chip, Button, IconButton } from "@mui/joy";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Plus, Pencil, Trash } from "lucide-react";
import useStore from "../stores";
import CategoryModal from "../CategoryModal";
import CategorySingle from "../CategorySingle";

interface BudgetPieProps {
    categories: Category[];
    budgets: Budget[];
    categoryMutations: {
        editMutation: UseBaseMutationResult<
            AxiosResponse<{ msg: string }>,
            unknown,
            { category: NewCategory; id: string },
            unknown
        >;
        deleteMutation: UseBaseMutationResult<
            AxiosResponse<{ msg: string }>,
            unknown,
            string,
            unknown
        >;
        addMutation: UseBaseMutationResult<
            AxiosResponse<{ msg: string }>,
            unknown,
            NewCategory,
            unknown
        >;
    };
}

const BudgetPie = ({
    categories,
    budgets,
    categoryMutations,
}: BudgetPieProps) => {
    const { editMutation, deleteMutation, addMutation } = categoryMutations;
    const [series, setSeries] = useState<Series>([]);
    const [seriesType, toggleSeriesType] = useReducer(
        (seriesType) => !seriesType,
        true,
    );
    const [open, setOpen] = useState<boolean>(false);
    const [mode, toggleMode] = useReducer((mode) => !mode, true);

    const userId = useStore((state) => state.user.id);

    const [name, setName] = useState<string>("");
    const [color, setColor] = useState<string>("#000");

    const openModal: React.MouseEventHandler = (e) => {
        e.preventDefault();
        setOpen(true);
    };

    const closeModal: React.MouseEventHandler = (e) => {
        e.preventDefault();
        setOpen(false);
    };

    const resetState = () => {
        setName("");
        setColor("#000");
    };

    const generateSeries = () => {
        let data: Series = [];
        categories.forEach((category) => {
            const count = budgets.filter(
                (budget) => budget.categoryId === category.categoryId,
            ).length;
            let amount = 0;
            budgets.forEach((budget) => {
                if (budget.categoryId === category.categoryId)
                    amount += Math.abs(budget.amount);
            });
            data.push({
                id: category.categoryId.toString(),
                value: seriesType ? amount : count,
                label: category.name,
                color: category.color,
            });
        });
        return data;
    };

    useEffect(() => {
        setSeries(generateSeries());
    }, [categories, budgets, seriesType]);

    const generateCategory = () => {
        const category: NewCategory = {
            name: name,
            color: color,
            userId: userId,
        };

        return category;
    };

    const onAddCategory: ButtonChangeHandler = (e) => {
        e.preventDefault();
        addMutation
            .mutateAsync(generateCategory())
            .then(() => {
                resetState();
                closeModal(e);
            })
            .catch((err) => console.log(err));
    };

    return (
        <>
            <div className="flex flex-col items-center self-center mb-24 w-[100vw] h-[40vh] min-h-fit">
                <div className="w-full h-full">
                    <h1
                        onClick={toggleSeriesType}
                        className="text-xl text-center sm:text-2xl hover:underline hover:cursor-pointer"
                    >
                        {seriesType ? "Amount breakdown" : "Count breakdown"}
                    </h1>
                    <p className="text-sm text-center text-gray-500">
                        (click to change)
                    </p>

                    {series.length !== 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart width={1000} height={500}>
                                <Pie
                                    data={series}
                                    innerRadius={50}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    <Tooltip />
                                    {series.map((item, key) => (
                                        <Cell
                                            key={`cell-${key}`}
                                            fill={item.color}
                                        />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        // Circle
                        <div className=""></div>
                    )}
                </div>
                <div className="flex flex-row justify-center items-center mt-5 h-auto sm:space-x-5">
                    <IconButton
                        className="mr-5"
                        sx={{
                            margin: {
                                xs: "1.25rem",
                                sm: "0",
                            },
                        }}
                        variant="soft"
                        onClick={toggleMode}
                    >
                        {mode ? <Pencil /> : <Trash />}
                    </IconButton>

                    <div className="flex flex-row flex-wrap gap-2 justify-center items-center self-center space-x-2 sm:space-x-5">
                        {categories.map((category, key) => (
                            <CategorySingle
                                key={key}
                                mode={mode}
                                category={category}
                                editMutation={editMutation}
                                deleteMutation={deleteMutation}
                            />
                        ))}
                    </div>
                    <IconButton
                        sx={{
                            margin: "1.25rem",
                        }}
                        variant="soft"
                        onClick={openModal}
                    >
                        <Plus />
                    </IconButton>
                </div>
            </div>
            <CategoryModal
                open={open}
                onClose={closeModal}
                onSubmit={onAddCategory}
                buttonText="Add"
                buttonLoading={addMutation.isLoading}
                options={{
                    modalTitle: "Add Category",
                    name: {
                        label: "Name",
                        value$: name,
                        placeholder: "Category Name",
                        onChange: (e) => setName(e.target.value),
                    },
                    color: {
                        value: color,
                        onChange: (color) => setColor(color),
                    },
                }}
            />
        </>
    );
};

export default BudgetPie;
