import { Tooltip } from "@mui/joy";
import React from "react";

const AddTooltip = ({
    children,
    tooltip = "",
}: {
    children: React.ReactElement;
    tooltip?: string;
}) => {
    if (tooltip != "") {
        return (
            <Tooltip
                sx={{
                    borderRadius: "0.5rem",
                }}
                arrow
                variant="outlined"
                size="md"
                title={tooltip}
            >
                {children}
            </Tooltip>
        );
    }

    return <>{children}</>;
};

export default AddTooltip;
