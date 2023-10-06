import OnBoarding from "@/components/OnBoarding";
import React from "react";

const Page = ({ params }: { params: { id: string } }) => {
    return <OnBoarding id={params.id} />;
};

export default Page;
