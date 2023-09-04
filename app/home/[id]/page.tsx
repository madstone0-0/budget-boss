import React from "react";

const Page = ({ params }: { params: { id: string } }) => {
    return <h1>Home {params.id}</h1>;
};

export default Page;
