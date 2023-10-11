import React, { ReactNode } from "react";
import { Transition } from "react-transition-group";
import { Modal, ModalClose, ModalDialog } from "@mui/joy";
import { ButtonChangeHandler } from "../types";

const BaseModal = ({
    open,
    onClose,
    children,
    className = "",
}: {
    open: boolean;
    onClose: ButtonChangeHandler;
    children: ReactNode;
    className?: string;
}) => {
    return (
        <Modal
            className={className}
            aria-labelledby="modal-title"
            aria-describedby="modal-desc"
            open={open}
            onClose={onClose}
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 10,
                zIndex: 500,
            }}
        >
            <ModalDialog
                sx={{
                    md: {
                        minWidth: "50vw",
                        maxWidth: "70vw",
                    },
                    xs: {
                        minWidth: "90vw",
                        maxWidth: "90vw",
                    },
                    borderRadius: 10,
                    p: 3,
                    boxShadow: "lg",
                }}
            >
                <ModalClose className="m-2" variant="plain" />
                {children}
            </ModalDialog>
        </Modal>
    );
};

export default BaseModal;
