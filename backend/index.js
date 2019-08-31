const express = require("express");
const compression = require("compression");

const defaultHeaders = require("./src/middlewares/defaultHeaders");
const redirectRouter = require("./routers/redirectRouter");
const proxiesRouter = require("./routers/proxiesRouter");
const apiRouter = require("./routers/apiRouter");


const components = [
	compression(),
	defaultHeaders,
	redirectRouter,
	proxiesRouter,
	apiRouter,
];

const app = components.reduce((app, c) => app.use(c), express());

const port = 9000; // TODO: Get this from env

app.listen(port);
console.log(`Server running on port ${port}`);

