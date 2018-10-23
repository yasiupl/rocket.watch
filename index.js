const express = require("express");
const compression = require("compression");
const request = require("request");
const ytdl = require("ytdl-core");

const keys = require("./keys.json");
const RocketWatch = require("./server.js");
const redirectRouter = require("./routers/redirectRouter");
const proxyRouter = require("./routers/proxyRouter");


const setHeaders = function (req, res, next) {
  res.set({
    //"Content-Security-Policy": `default-src data: blob: https: "unsafe-inline" "unsafe-eval"; connect-src https:; frame-src http: https:`,
    "Strict-Transport-Security": "max-age=2592000; includeSubDomains; preload",
    "Referrer-Policy": "same-origin",
    "X-Content-Type-Options": "nosniff",
    "X-XSS-Protection": "1",
    "Access-Control-Allow-Origin": "https://rocket.watch",

    "Cache-Control": "max-age=86400"
  });
  next();
}

const middlewares =
  [
    setHeaders,
    compression(),
    express.static("static"),
  ];


const routers =
  [
    redirectRouter,
    proxyRouter
  ];

const app = express();
// TODO: Move this all router
    app.post('/api/patreon', function(req, res) {
      console.log(req.body)
      res.json({
        status: "success"
      })
    });

    app.route('/api/*').get(function(req, res) {
      if (req.url.split("api/")[1]) {
        RocketWatch.load(req.url.split("api/")[1], function(d) {
          res.set({
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'max-age=' + Math.round((d.expire - Date.now()) / 1000)
          });
          res.json(d);
        });
      } else {
        res.json({
          endpoints: {
            launch: "https://rocket.watch/api/launch",
            mission: "https://rocket.watch/api/mission",
            rocket: "https://rocket.watch/api/rocket",
            agency: "https://rocket.watch/api/agency"
          },
          docs: "https://launchlibrary.net/docs/1.4/api.html",
          info: "https://launchlibrary.net",
          version: "1.4.1"
        })
      }
    });


// TODO: Move this all router [end]

const plugins = [].concat(middlewares).concat(routers);
plugins.forEach(x => app.use(x))

app.listen(8080);
console.log("Server running on port 8080");
