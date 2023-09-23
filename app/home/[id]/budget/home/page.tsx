import React from "react";
import {
    API_BASE,
    API_GET_ALL_BUDGETS,
} from "../../../../../src/components/constants";
import { cookies } from "next/headers";
import axios from "axios";
import { Button } from "@mui/joy";
import BudgetList from "../../../../../src/components/BudgetList";
import { Plus } from "lucide-react";
import Unauthorized from "../../../../../src/components/utils/Unauthorized";

const Page = async () => {
    // try {
    return (
        <>
            <BudgetList />
        </>
    );
    // } catch (err: any) {
    //     console.log({ err });
    //     if (err == "Unauthorized") {
    //         return <Unauthorized />;
    //     }
    //     return (
    //         <div className="flex flex-col justify-center items-center my-52 h-full text-center">
    //             <h1 className="min-w-max text-2xl font-bold sm:text-3xl">
    //                 Something went wrong
    //             </h1>
    //             <p> {err.message}</p>
    //         </div>
    //     );
    // }
};

export default Page;
