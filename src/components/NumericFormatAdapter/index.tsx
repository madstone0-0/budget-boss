import React from "react";
import { NumericFormat } from "react-number-format";
import usePersistantStore from "../stores/persistantStore";

const NumericFormatAdapter = React.forwardRef(function NumericFormatAdapter(
    props: { name: string; onChange: (arg0: object) => void },
    ref,
) {
    const { onChange, ...other } = props;
    const currency = usePersistantStore((state) => state.options.currency);

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
            prefix={`${currency} `}
        />
    );
});

export default NumericFormatAdapter;
