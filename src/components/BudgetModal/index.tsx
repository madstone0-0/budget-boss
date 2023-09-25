import React, { ChangeEventHandler } from "react";
import { ButtonChangeHandler, Category, InputChangeHandler } from "../types";
import BaseModal from "../BaseModal";
import {
    DialogTitle,
    IconButton,
    Select,
    Option,
    RadioGroup,
    Box,
    Button,
} from "@mui/joy";
import Radio, { radioClasses } from "@mui/joy/Radio";
import FormWrapper from "../FormWrapper";
import InputWrapper from "../InputWrapper";
import { NumericFormat } from "react-number-format";
import { XCircle } from "lucide-react";

type Value<T, Handler = InputChangeHandler> = {
    label: string;
    placeholder: string;
    value$: T;
    onChange: Handler;
};

interface BudgetModalProps {
    open: boolean;
    onClose: ButtonChangeHandler;
    onSubmit: ButtonChangeHandler;
    buttonText: string;
    options: {
        modalTitle: string;

        name: Value<string>;
        amount: Value<string>;
        dateAdded: Value<string>;
        category: {
            label: string;
            placeholder: string;
            value$: number | null;
            onChange: (_: number | null) => void;
            categories: Category[];
        };
        // type: Value<"income" | "expense", ChangeEventHandler<HTMLInputElement>>;
        type: {
            value$: "income" | "expense";
            onChange: ChangeEventHandler<HTMLInputElement>;
        };
    };
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
            prefix="₵ "
        />
    );
});

const BudgetModal = ({
    open,
    onClose,
    onSubmit,
    options,
    buttonText,
}: BudgetModalProps) => {
    const { modalTitle, name, amount, dateAdded, category, type } = options;
    const action = React.useRef<null | { focusVisible(): void }>(null);

    return (
        <BaseModal open={open} onClose={onClose}>
            <DialogTitle>{modalTitle}</DialogTitle>
            <FormWrapper onSubmit={onSubmit}>
                <InputWrapper
                    {...name}
                    muiOptions={{
                        required: true,
                    }}
                    labelClassName="text-sm"
                />
                <InputWrapper
                    {...amount}
                    muiOptions={{
                        required: true,
                        slotProps: {
                            input: {
                                component: NumericFormatAdapter,
                            },
                        },
                    }}
                    labelClassName="text-sm"
                />
                <InputWrapper
                    muiOptions={{
                        required: true,
                    }}
                    type="date"
                    labelClassName="text-sm"
                    {...dateAdded}
                />
                <Select
                    action={action}
                    placeholder={category.placeholder}
                    value={category.value$}
                    required
                    onChange={(_e, newVal) => category.onChange(newVal)}
                    {...(category.value$ != null && {
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
                                    category.onChange(null);
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
                    {category.categories.length != 0 ? (
                        category.categories.map((category) => (
                            <Option
                                key={category.categoryId}
                                value={category.categoryId}
                            >
                                {category.name}
                            </Option>
                        ))
                    ) : (
                        <></>
                    )}
                </Select>
                <RadioGroup
                    name="budget-type"
                    value={type}
                    className="w-full"
                    onChange={type.onChange}
                    orientation="horizontal"
                >
                    {["income", "expense"].map((currType, key) => (
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
                                value={currType}
                                overlay
                                disableIcon
                                label={
                                    {
                                        income: "Income",
                                        expense: "Expense",
                                    }[currType]
                                }
                                variant={
                                    type.value$ === currType ? "solid" : "plain"
                                }
                                color="primary"
                                slotProps={{
                                    input: { "aria-label": currType },
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
                <Button
                    color="primary"
                    sx={{ fontSize: "1.2rem", lineHeight: "1.75rem" }}
                    type="submit"
                >
                    {buttonText}
                </Button>
            </FormWrapper>
        </BaseModal>
    );
};

export default BudgetModal;
