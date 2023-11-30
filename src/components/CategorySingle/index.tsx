import React, { useState } from "react";
import { ButtonChangeHandler, Category, NewCategory } from "../types";
import { UseBaseMutationResult } from "react-query";
import { AxiosResponse } from "axios";
import useStore from "../stores";
import { Button, Skeleton } from "@mui/joy";
import CategoryModal from "../CategoryModal";

interface CategorySingleProps {
    mode: boolean;
    category: Category;
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
}

const CategorySingle = ({
    mode,
    category,
    editMutation,
    deleteMutation,
}: CategorySingleProps) => {
    const userId = useStore((state) => state.user.id);
    const [open, setOpen] = useState<boolean>(false);

    const openModal: React.MouseEventHandler = (e) => {
        e.preventDefault();
        setOpen(true);
    };

    const closeModal: React.MouseEventHandler = (e) => {
        e.preventDefault();
        setOpen(false);
    };

    const [name, setName] = useState<string>(category.name);
    const [color, setColor] = useState<string>(category.color);
    const [weight, setWeight] = useState<string>(category.weight);

    const resetState = () => {
        setName("");
        setColor("#000");
        setWeight("0");
    };

    const onDeleteCategory = (e: React.MouseEvent<Element, MouseEvent>) => {
        e.preventDefault();
        deleteMutation.mutate(category.categoryId.toString());
    };

    const generateCategory = () => {
        const category: NewCategory = {
            name: name,
            color: color,
            userId: userId,
            weight: weight,
        };

        console.log({ category });
        return category;
    };

    const onEditCategory = (e: React.MouseEvent<Element, MouseEvent>) => {
        if (!name || !color || !weight) {
            throw new Error("Missing required fields");
        }
        e.preventDefault();
        editMutation
            .mutateAsync({
                id: category.categoryId.toString(),
                category: generateCategory(),
            })
            .then(() => {
                closeModal(e);
            })
            .catch((err) => console.log(err));
    };

    return (
        <>
            <Button
                onClick={(e) => (mode ? openModal(e) : onDeleteCategory(e))}
                variant="soft"
                loading={deleteMutation.isLoading}
                sx={{
                    backgroundColor: category.color,
                    borderRadius: "2rem",
                    height: "fit-content",
                    fontSize: {
                        xs: "0.7rem",
                        md: "1.5rem",
                    },
                    width: {
                        xs: "min-content",
                        md: "10rem",
                    },
                }}
            >
                <div>
                    <p>{category.name}</p>
                    <p className="text-xs sm:text-sm">{category.weight} %</p>
                </div>
            </Button>
            <CategoryModal
                open={open}
                onClose={closeModal}
                onSubmit={onEditCategory}
                buttonText="Update"
                buttonLoading={editMutation.isLoading}
                options={{
                    modalTitle: "Edit Category",
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
                    weight: {
                        value$: weight,
                        onChange: (e) => setWeight(e.target.value.toString()),
                        label: "Weight",
                        placeholder: "0.00",
                    },
                }}
            />
        </>
    );
};
export default CategorySingle;
