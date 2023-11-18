import React, {
    useState,
    useReducer,
    useEffect,
    HTMLInputTypeAttribute,
} from "react";
import { InputChangeHandler } from "../types";
import {
    FormControl,
    FormLabel,
    Input,
    IconButton,
    InputTypeMap,
    FormHelperText,
} from "@mui/joy";
import { EyeIcon, EyeOffIcon, Calendar } from "lucide-react";

const InputWrapper = ({
    label,
    placeholder,
    type = "text",
    value$: value,
    onChange,
    labelClassName = "text-xl",
    muiOptions = {},
    tooltip = "",
    disabled = false,
}: {
    label: string;
    placeholder: string;
    type?: HTMLInputTypeAttribute;
    value$: React.DetailedHTMLProps<
        React.InputHTMLAttributes<HTMLInputElement>,
        HTMLInputElement
    >["value"];
    onChange: InputChangeHandler;
    labelClassName?: string;
    muiOptions?: InputTypeMap["props"];
    tooltip?: string;
    disabled?: boolean;
}) => {
    const [pwdHidden, updatePwdState] = useReducer((hidden) => !hidden, true);
    const [mounted, setMounted] = useState<boolean>(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    const defaultOptions: InputTypeMap["props"] = {
        value: value,
        size: "lg",
        onChange: onChange,
        className: "min-w-[30%] sm:min-w-[50%]",
        type: type,
        placeholder: placeholder,
    };

    if (!mounted) {
        return (
            <>
                <FormControl>
                    <FormLabel className={`${labelClassName} font-medium`}>
                        label
                    </FormLabel>
                    <Input size="lg" type="text" />
                </FormControl>
            </>
        );
    }

    // https://stackoverflow.com/a/46593006
    const renderInputType = (type: string) => {
        switch (type) {
            case "password":
                return (
                    <Input
                        {...defaultOptions}
                        {...muiOptions}
                        disabled={disabled}
                        type={pwdHidden ? "password" : "text"}
                        endDecorator={
                            <IconButton
                                sx={(theme) => ({
                                    color: theme.palette.text.primary,
                                    backgroundColor:
                                        theme.palette.background.body,
                                })}
                                variant="plain"
                                onClick={updatePwdState}
                            >
                                {pwdHidden ? <EyeIcon /> : <EyeOffIcon />}
                            </IconButton>
                        }
                    />
                );
            default:
                return <Input {...defaultOptions} {...muiOptions} />;
        }
    };

    return (
        <FormControl disabled={disabled}>
            <FormLabel className={`text-sm font-medium ${labelClassName}`}>
                {label}
            </FormLabel>
            {renderInputType(type)}
            {tooltip !== "" && <FormHelperText>{tooltip}</FormHelperText>}
        </FormControl>
    );
};

export default InputWrapper;
