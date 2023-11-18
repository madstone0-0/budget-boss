import { Chip } from "@mui/joy";
import React from "react";
import usePersistantStore from "../stores/persistantStore";
import { CURRENCIES } from "../constants";
import { useCurrencyFormatter } from "../utils";

interface TemplateCategoriesProps {
    income: number;
    name: string;
    color: string;
    weight: number;
}

const TemplateCategory = ({
    income,
    name,
    color,
    weight,
}: TemplateCategoriesProps) => {
    const { formatter } = useCurrencyFormatter();

    return (
        <>
            <Chip
                variant="soft"
                sx={{
                    backgroundColor: color,
                    fontSize: "1.5rem",
                    lineHeight: "1.75rem",
                    minWidth: "10rem",
                    minHeight: "2.5rem",
                    maxHeight: "max-content",
                    fontWeight: "700",
                    textAlign: "center",
                }}
            >
                {name}
            </Chip>
            <p className="text-xl min-w-[30%] text-center">
                {weight.toFixed(2)}%
            </p>
            <p className="text-xl min-w-[10%] text-right">
                {formatter.format((income * weight) / 100)}
            </p>
        </>
    );
};

export default TemplateCategory;
