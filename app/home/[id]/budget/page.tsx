import React from "react";
import BugdgetPage from "../../../../src/components/BudgetPage";

const Page = ({ params }: { params: { id: string } }) => {
    return <BugdgetPage id={params.id} />;
};

export default Page;
