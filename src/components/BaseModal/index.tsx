import React, { ReactNode, ReactElement } from "react";
import { Modal, ModalClose, Box, Sheet, ModalDialog } from "@mui/joy";
import { ButtonChangeHandler } from "../types";

const BaseModal = ({
    open,
    onClose,
    children,
}: {
    open: boolean;
    onClose: ButtonChangeHandler;
    children: ReactNode;
}) => {
    return (
        <Modal
            aria-labelledby="modal-title"
            aria-describedby="modal-desc"
            open={open}
            onClose={onClose}
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 10,
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
