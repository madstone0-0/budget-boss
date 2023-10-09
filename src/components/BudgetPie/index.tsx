import React, { useState, useEffect } from "react";
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
import { Plus } from "lucide-react";
import useStore from "../stores";
import CategoryModal from "../CategoryModal";

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

    const userId = useStore((state) => state.user.id);

    const [name, setName] = useState<string>("");
    const [color, setColor] = useState<string>("");

    const openModal: ButtonChangeHandler = (e) => {
        e.preventDefault();
        setOpen(true);
    };

    const closeModal: ButtonChangeHandler = (e) => {
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

    const onDeleteCategory = (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        id: string,
    ) => {
        e.preventDefault();
        deleteMutation.mutate(id);
        closeModal(e);
    };

    return (
        <>
            <div className="flex flex-col items-center self-center w-[80vw] h-[50vh]">
                <div className="w-full h-full -z-10">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart width={800} height={400}>
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
                <div className="flex overflow-x-scroll flex-row space-x-5">
                    {categories.map((category, key) => (
                        <Chip
                            // onClick={(e) =>
                            //     onDeleteCategory(
                            //         e,
                            //         category.categoryId.toString(),
                            //     )
                            // }
                            variant="soft"
                            sx={{
                                backgroundColor: category.color,
                                fontSize: "1.5rem",
                            }}
                            key={key}
                        >
                            {category.name}
                        </Chip>
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
                        label: "Color",
                        placeholder: "#FFFFFF",
                        value$: color,
                        onChange: (e) => setColor(e.target.value),
                    },
                }}
            />
        </>
    );
};

export default BudgetPie;
