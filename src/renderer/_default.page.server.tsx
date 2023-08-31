import ReactDOMServer from "react-dom/server";
import React from "react";
import { escapeInject, dangerouslySkipEscape } from "vite-plugin-ssr/server";
import { PageContextServer } from "./types";
import { PageShell } from "./PageShell";

export { render };
export { passToClient };

const passToClient = ["pageProps"];

async function render(pageContext: PageContextServer) {
    const { Page, pageProps } = pageContext;
    if (!Page)
        throw new Error(
            "My render() hook expects pageContext.Page to be defined",
        );

    const pageHtml = ReactDOMServer.renderToString(
        <PageShell pageContext={pageContext}>
            <Page {...pageProps} />
        </PageShell>,
    );

    const { documentProps } = pageContext.exports;
    const title = (documentProps && documentProps.title) || `INVEBB`;
    const desc = (documentProps && documentProps.description) || `INVEBB`;

    const documentHtml = escapeInject`<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link href="./output.css" rel="stylesheet" type="text/css" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
        />
        <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Actor:wght@300;400;500;600;700&display=swap"
        />
        <meta name="description" content="${desc}" />
        <title>${title}</title>
      </head>
      <body>
        <div id="root">${dangerouslySkipEscape(pageHtml)}</div>
      </body>
    </html>`;

    return {
        documentHtml,
        pageContext: {},
    };
}
