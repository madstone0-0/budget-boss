import express from "express";
import compression from "compression";
import { root } from "./root";
import { renderPage } from "vite-plugin-ssr/server";

const isProduction = process.env.NODE_ENV == "production";

startServer();

async function startServer() {
    const app = express();

    app.use(compression());

    if (isProduction) {
        const sirv = (await import("sirv")).default;
        app.use(sirv(`${root}/dist/client`));
    } else {
        const vite = await import("vite");
        const viteDevMiddlware = (
            await vite.createServer({
                root,
                server: { middlewareMode: true },
            })
        ).middlewares;
        app.use(viteDevMiddlware);
    }

    app.get("*", async (req, res, next) => {
        const pageContextInit = {
            urlOriginal: req.originalUrl,
        };

        const pageContext = await renderPage(pageContextInit);
        const { httpResponse } = pageContext;
        if (!httpResponse) {
            return next();
        } else {
            const { body, statusCode, headers, earlyHints } = httpResponse;
            if (res.writeEarlyHints)
                res.writeEarlyHints({
                    link: earlyHints.map((e) => e.earlyHintLink),
                });
            headers.forEach(([name, value]) => res.setHeader(name, value));
            res.status(statusCode);
            res.send(body);
        }
    });

    const port = process.env.PORT || 5173;
    app.listen(port);
    console.log(`Server running at http://localhost:${port}`);
}

// console.log("Ballin");
