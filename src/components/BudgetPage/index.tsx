"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import LoadingBar from "../LoadingBar";
import useStore from "../stores";

const BugdgetPage = ({ id }: { id: string }) => {
    const hasCreatedBudget = useStore((state) => state.user.hasCreatedBudget);

    const router = useRouter();
    if (hasCreatedBudget) {
        router.push(`/home/${id}/budget/home`);
        return null;
    } else {
        router.push(`/home/${id}/budget/onboarding`);
        return null;
    }
};

export default BugdgetPage;
