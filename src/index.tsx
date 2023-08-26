import React from "react";
import ReactDOM from "react-dom/client";
import Main from "./components/Main";
import "./index.css";

const container = document.getElementById("root")!;
const root = ReactDOM.createRoot(container);

root.render(
    <React.StrictMode>
        <Main />
    </React.StrictMode>,
);
