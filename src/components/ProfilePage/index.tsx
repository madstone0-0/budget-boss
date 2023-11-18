"use client";
import React, { useState, useEffect } from "react";
import useStore from "../stores";
import { ButtonChangeHandler, Category } from "../types";
import { useRouter } from "next/navigation";
import { deleteJWTCookie, getJWTCookie } from "@/actions";
import {
    Avatar,
    Box,
    Button,
    FormControl,
    FormLabel,
    Select,
    Stack,
    Option,
    Alert,
} from "@mui/joy";
import BaseModal from "../BaseModal";
import { fetch } from "../utils/Fetch";
import { API_DELETE_ACC, CURRENCIES } from "../constants";
import { useSnackbar } from "notistack";
import { AxiosError } from "axios";
import usePersistantStore from "../stores/persistantStore";
import TemplateView from "../TemplateView";
import useQueriesAndMutations from "../utils/queries";
import { AlertCircle } from "lucide-react";

const ProfilePage = () => {
    const [mounted, setMounted] = useState(false);
    const [open, setOpen] = useState(false);

    const openModal: ButtonChangeHandler = (e) => {
        e.preventDefault();
        // enqueueSnackbar("This action cannot be reverted", {
        //     variant: "info",
        //     autoHideDuration: 10000,
        // });
        // enqueueSnackbar("All your data will be deleted", {
        //     variant: "info",
        //     autoHideDuration: 10000,
        // });
        setOpen(true);
    };

    const closeModal: ButtonChangeHandler = (e) => {
        e.preventDefault();
        setOpen(false);
    };

    const user = useStore((state) => state.user);
    const clearUser = useStore((state) => state.clearUser);
    const currency = usePersistantStore((state) => state.options.currency);
    const updateCurrency = usePersistantStore((state) => state.updateCurrency);
    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();

    const { queries, mutations } = useQueriesAndMutations(user);
    const { budgetOptionQuery } = queries;
    const { budgetOptionEditMutation } = mutations;

    const generateCategories = () => {
        let categories: Category[] = [];
        if (
            budgetOptionQuery.data?.budgetOptions?.budgetOptions?.options !=
            undefined
        ) {
            budgetOptionQuery.data.budgetOptions.budgetOptions.options.forEach(
                (option) => {
                    const newCategory: Category = {
                        categoryId: option.category.categoryId!,
                        userId: option.category.userId!,
                        name: option.category.name!,
                        color: option.category.color!,
                        weight: option.weight.toString(),
                    };
                    categories.push(newCategory);
                },
            );
        }
        return categories;
    };

    const generateIncome = () =>
        budgetOptionQuery.data?.budgetOptions?.budgetOptions?.income || 0;

    const handleLogout: ButtonChangeHandler = (e) => {
        e.preventDefault();
        clearUser();
        (async () => {
            await deleteJWTCookie("token");
            await deleteJWTCookie("refreshToken");
        })().catch((err) => console.log(err));
        router.prefetch("/");
        router.replace("/");
    };

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted)
        return (
            <div className="flex flex-col justify-center items-center p-5 space-y-10 align-middle">
                <Avatar
                    variant="soft"
                    sx={{
                        height: "10rem",
                        width: "10rem",
                        fontSize: "5rem",
                    }}
                    alt="user avatar"
                    size="lg"
                >
                    US
                </Avatar>
                <h1 className="text-xl sm:text-3xl">user@email.com</h1>
                <Button>Logout</Button>
                <Button color="danger">Delete Account</Button>
            </div>
        );

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    const onDeleteAccount: ButtonChangeHandler = async (e) => {
        const token = await getJWTCookie("token");
        e.preventDefault();
        fetch
            .delete<{ msg: string }>(`${API_DELETE_ACC}${user.id}`, {
                headers: {
                    Authorization: `Bearer ${token?.value}`,
                },
            })
            .then((res) => {
                console.log({ res });
                if (res.status == 200) {
                    handleLogout(e);
                    enqueueSnackbar(res.data.msg, {
                        variant: "success",
                    });
                }
            })
            .catch((err) => {
                console.log({ err });
                let err_msg = "";
                if (err instanceof AxiosError) {
                    err_msg = err.response?.data.msg;
                    if (err_msg === undefined) err_msg = err.message;
                } else if (err instanceof Error) {
                    err_msg = err.message;
                } else {
                    err_msg = "Unknown error";
                }

                enqueueSnackbar(err_msg, { variant: "error" });
            });
    };

    return (
        <div className="flex flex-col justify-center items-center p-5 space-y-10 align-middle">
            <Avatar
                variant="soft"
                sx={{
                    height: "10rem",
                    width: "10rem",
                    fontSize: "5rem",
                }}
                alt="user avatar"
                size="lg"
            >
                {user.email.slice(0, 2).toUpperCase()}
            </Avatar>
            <h1 className="text-xl sm:text-3xl">{user.email}</h1>
            <Button onClick={handleLogout}>Logout</Button>
            <Button color="danger" onClick={openModal}>
                Delete Account
            </Button>
            <TemplateView
                disabled
                income={generateIncome()}
                categories={generateCategories()}
                editMutation={budgetOptionEditMutation}
            />
            <Box
                sx={(theme) => ({
                    minWidth: "80vw",
                    minHeight: "5rem",
                    backgroundColor: theme.palette.background.level1,
                    padding: "2rem",
                    borderRadius: "1rem",
                    fontSize: "1.25rem",
                    lineHeight: "1.75rem",
                })}
            >
                <h1 className="mb-10 text-3xl">Settings</h1>
                <Stack spacing={3}>
                    <FormControl orientation="horizontal">
                        <FormLabel
                            sx={{
                                fontSize: "1.25rem",
                                lineHeight: "1.75rem",
                            }}
                        >
                            Currency
                        </FormLabel>
                        <Select
                            size="md"
                            defaultValue={currency}
                            onChange={(_e, val) => updateCurrency(val!)}
                        >
                            {CURRENCIES.map((curr, key) => (
                                <Option key={key} value={curr.sym}>
                                    {curr.name}
                                </Option>
                            ))}
                        </Select>
                    </FormControl>
                </Stack>
            </Box>
            <BaseModal open={open} onClose={closeModal}>
                <div className="flex flex-col p-5 space-y-10">
                    <h1 className="text-xl font-bold">
                        Are you sure you want to delete your account?
                    </h1>
                    <Alert
                        sx={{
                            fontSize: "1rem",
                            fontWeight: "600",
                            borderRadius: 5,
                        }}
                        startDecorator={<AlertCircle />}
                        color="danger"
                    >
                        This action cannot be undone. All your data will be
                        deleted from our servers
                    </Alert>
                    <div className="flex flex-row justify-between">
                        <Button
                            sx={{
                                fontSize: "1.25rem",
                                lineHeight: "1.75rem",
                                width: "30%",
                            }}
                            color="danger"
                            variant="outlined"
                            onClick={onDeleteAccount}
                        >
                            Yes
                        </Button>
                        <Button
                            sx={{
                                fontSize: "1.25rem",
                                lineHeight: "1.75rem",
                                width: "30%",
                            }}
                            variant="outlined"
                            onClick={closeModal}
                        >
                            No
                        </Button>
                    </div>
                </div>
            </BaseModal>
        </div>
    );
};

export default ProfilePage;
