import React from "react";
import { NumericFormat } from "react-number-format";

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

export default NumericFormatAdapter;
