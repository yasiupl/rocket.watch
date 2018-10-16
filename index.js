const express = require("express");
const compression = require("compression");
const request = require("request");
const ytdl = require("ytdl-core");

const keys = require("./keys.json");
const RocketWatch = require("./server.js");
const redirectRouter = require("./routers/redirectRouter");


const ble_middleware = function(req, res, next) {
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
    ble_middleware, //TODO: How this should be name and what it should do?
    compression(),
    express.static("static"),
];

const routers =
[
    redirectRouter,
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

    app.route('/proxy/*').get(function(req, res) {
      request(req.url.split("proxy/")[1]).pipe(res);
    });

    app.route('/logo/*').get(function(req, res) {
      request("https://logo.clearbit.com/" + req.url.split("logo/")[1]).pipe(res);
    });

    app.route('/flag/*').get(function(req, res) {
      request("https://restcountries.eu/data/" + req.url.split("flag/")[1].toLowerCase() + ".svg").pipe(res);
    });

    app.route('/map/*').get(function(req, res) {
      request("https://maps.googleapis.com/maps/api/staticmap" + req.url.split("map/")[1].toLowerCase() + "&key="+ keys.google).pipe(res);
    });

    app.route('/rocket/*').get(function(req, res) {
      request("https://s3.amazonaws.com/launchlibrary/RocketImages/" + req.url.split("rocket/")[1].toLowerCase()).pipe(res);
    });

    app.route('/external/notifications.js').get(function(req, res) {
      request('https://cdn.onesignal.com/sdks/OneSignalSDK.js').pipe(res);
    });

    app.route('/external/promotion.js').get(function(req, res) {
      request('https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js').pipe(res);
    });

    app.route('/external/analytics.js').get(function(req, res) {
      request('https://www.google-analytics.com/analytics.js').pipe(res);
    });

    app.route('/external/vidpulse.js').get(function(req, res) {
      request('https://s.vidpulse.com/all/vp.js').pipe(res);
    });



    app.route('/audio/*').get(function(req, res) {
      res.set({
        'Content-Type': 'audio/mpeg'
      });
      ytdl(req.url.split("audio/")[1], {
        filter: 'audioonly'
      }).pipe(res);
    });

    // TODO: Can we kill it? Why is it here?
    app.get('/time', function(req, res) {
      res.json({
        time: Date.now()
      });
    });
// TODO: Move this all router [end]

const plugins = [].concat(middlewares).concat(routers);
plugins.forEach(x => app.use(x))

app.listen(8080);
console.log("Server running on port 8080");
