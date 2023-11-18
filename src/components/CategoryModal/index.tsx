import React from "react";
import { ButtonChangeHandler, Value } from "../types";
import BaseModal from "../BaseModal";
import FormWrapper from "../FormWrapper";
import { Button, DialogTitle } from "@mui/joy";
import InputWrapper from "../InputWrapper";
import { HexColorPicker, HexColorInput } from "react-colorful";

interface CategoryModalProps {
    open: boolean;
    onClose: ButtonChangeHandler;
    onSubmit: ButtonChangeHandler;
    buttonText: string;
    buttonLoading: boolean;
    options: {
        modalTitle: string;
        name: Value<string>;
        color: {
            value: string;
            onChange: (value: string) => void;
        };
        weight: Value<string>;
    };
}

const CategoryModal = ({
    open,
    onClose,
    onSubmit,
    buttonText,
    buttonLoading,
    options,
}: CategoryModalProps) => {
    const { modalTitle, name, color, weight } = options;

    return (
        <BaseModal className="category-modal" open={open} onClose={onClose}>
            <DialogTitle>{modalTitle}</DialogTitle>
            <FormWrapper onSubmit={onSubmit}>
                <InputWrapper
                    {...name}
                    muiOptions={{ required: true }}
                    labelClassName="text-sm"
                />
                <InputWrapper
                    {...weight}
                    type="number"
                    muiOptions={{ required: true }}
                />
                <HexColorPicker
                    color={color.value}
                    onChange={(c) => color.onChange(c)}
                />
                <HexColorInput
                    className="self-center text-center text-base min-h-[2.5rem] hex-input sm:text-xl p-2 bg-[var(--color-background)] rounded-md"
                    color={color.value}
                    onChange={(c) => color.onChange(c)}
                />
                <Button
                    loading={buttonLoading}
                    sx={{ fontSize: "1.2rem", lineHeight: "1.75rem" }}
                    color="primary"
                    type="submit"
                >
                    {buttonText}
                </Button>
            </FormWrapper>
        </BaseModal>
    );
};

export default CategoryModal;
