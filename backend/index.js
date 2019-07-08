const express = require("express");
const compression = require("compression");

const redirectRouter = require("./routers/redirectRouter");
const proxiesRouter = require("./routers/proxiesRouter");
const apiRouter = require("./routers/apiRouter");


const middlewares = [
    compression(),
    defaultHeaders,
    redirectRouter,
    proxiesRouter,
    apiRouter,
];

const app = middlewares.reduce((app, m) => app.use(m), express());

const port = 9000; // TODO: Get this from env

app.listen(port);
console.log(`Server running on port ${port}`);

function defaultHeaders(_, response, next)
{
    response.set({
        "Strict-Transport-Security": "max-age=15768000; includeSubDomains; preload",
        "Referrer-Policy": "same-origin",
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "SAMEORIGIN",
        "X-XSS-Protection": "1",
        "Cache-Control": "max-age=2592000",
    });

    next();
}
