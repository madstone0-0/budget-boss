import React from "react";
import BudgetPage from "../../../../src/components/BudgetPage";

const Page = ({ params }: { params: { id: string } }) => {
    return <BudgetPage id={params.id} />;
};

export default Page;
