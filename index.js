const express = require("express");
const compression = require("compression");

const redirectRouter = require("./routers/redirectRouter");
const proxiesRouter = require("./routers/proxiesRouter");
const apiRouter = require("./routers/apiRouter");

const defaultHeaders = function(req, res, next) {
  res.set({
    //"Content-Security-Policy": `default-src 'self' localhost: blob: data:font/* "unsafe-inline" "unsafe-eval"; connect-src https: http://localhost:*; frame-src http: https:`,
    "Strict-Transport-Security": "max-age=15768000; includeSubDomains; preload",
    "Referrer-Policy": "same-origin",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "SAMEORIGIN",
    "X-XSS-Protection": "1",
    "Cache-Control": "max-age=2592000"
  });

  if (req.url.match(".css") || req.url.match(".js")) {
    res.set({
      "Cache-Control": "must-revalidate"
    });
  }
  next();
};

const middlewares = [
  defaultHeaders,
  compression(),
  express.static("static"),
  redirectRouter,
  proxiesRouter,
  apiRouter
];

const app = express();
middlewares.forEach(x => app.use(x));

app.listen(8080);
console.log("Server running on port 8080");
