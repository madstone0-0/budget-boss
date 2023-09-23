"use client";
import React, { useState, useEffect } from "react";
import { useRouter, redirect } from "next/navigation";
import LoadingBar from "../LoadingBar";
import useStore from "../stores";

const BudgetPage = ({ id }: { id: string }) => {
    const hasCreatedBudget = useStore((state) => state.user.hasCreatedBudget);

    const router = useRouter();
    if (hasCreatedBudget) {
        redirect(`/home/${id}/budget/home`);
    } else {
        redirect(`/home/${id}/budget/onboarding`);
    }
};

export default BudgetPage;
