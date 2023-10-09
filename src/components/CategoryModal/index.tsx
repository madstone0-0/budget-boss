import React from "react";
import { ButtonChangeHandler, Value } from "../types";
import BaseModal from "../BaseModal";
import FormWrapper from "../FormWrapper";
import { Button, DialogTitle } from "@mui/joy";
import InputWrapper from "../InputWrapper";

interface CategoryModalProps {
    open: boolean;
    onClose: ButtonChangeHandler;
    onSubmit: ButtonChangeHandler;
    buttonText: string;
    buttonLoading: boolean;
    options: {
        modalTitle: string;
        name: Value<string>;
        color: Value<string>;
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
    const { modalTitle, name, color } = options;

    return (
        <BaseModal open={open} onClose={onClose}>
            <DialogTitle>{modalTitle}</DialogTitle>
            <FormWrapper onSubmit={onSubmit}>
                <InputWrapper
                    {...name}
                    muiOptions={{ required: true }}
                    labelClassName="text-sm"
                />
                <InputWrapper
                    {...color}
                    muiOptions={{ required: true }}
                    labelClassName="text-sm"
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
