import React from "react";
import { SnackbarContent, CustomContentProps } from "notistack";

interface BaseSnackbarProps extends CustomContentProps {
    role: string;
    style: React.CSSProperties;
}

const BaseSnackar = React.forwardRef<HTMLDivElement, BaseSnackbarProps>(
    function BaseSnackar(props, ref) {
        const { id, message, role, style, ...other } = props;
        return (
            <SnackbarContent ref={ref} role={role} style={style} {...other}>
                {message}
            </SnackbarContent>
        );
    },
);

const SuccessSnackbar = () => {};
