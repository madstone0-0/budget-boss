import React, { Suspense } from "react";
import BudgetPage from "../../../../src/components/BudgetPage";
import LoadingBar from "@/components/LoadingBar";

const Page = ({ params }: { params: { id: string } }) => {
    return <BudgetPage id={params.id} />;
};

export default Page;
