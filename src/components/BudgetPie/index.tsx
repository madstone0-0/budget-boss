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

    const generateSeries = () => {
        let data: Series = [];
        categories.forEach((category) => {
            const count = budgets.filter(
                (budget) => budget.categoryId === category.categoryId,
            ).length;
            data.push({
                id: category.categoryId.toString(),
                value: count,
                label: category.name,
                color: category.color,
            });
        });
        return data;
    };

    useEffect(() => {
        setSeries(generateSeries());
    }, [categories, budgets]);

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
        addMutation.mutate(generateCategory());
        closeModal(e);
    };

    return (
        <>
            <div className="flex flex-col items-center self-center mb-5 sm:mb=10 w-[100vw] h-[40vh]">
                <h1 className="text-xl text-center sm:text-2xl">
                    Record count breakdown
                </h1>
                <div className="w-full h-full -z-10">
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
                </div>
                <div className="flex flex-row flex-wrap space-x-2 sm:space-x-5">
                    <IconButton variant="soft" onClick={toggleMode}>
                        {mode ? <Pencil /> : <Trash />}
                    </IconButton>
                    {categories.map((category, key) => (
                        <CategorySingle
                            key={key}
                            mode={mode}
                            category={category}
                            editMutation={editMutation}
                            deleteMutation={deleteMutation}
                        />
                    ))}
                    <IconButton variant="soft" onClick={openModal}>
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
