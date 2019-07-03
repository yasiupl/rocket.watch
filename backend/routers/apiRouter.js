var express = require('express');
var Router = express.Router();
const RocketWatch = require("../server.js");

Router.route("/api/").get((req, res) => {
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
});

Router.route("/api/*").get((req, res) => {
  RocketWatch.load(req.url.split("/api/")[1], function (d) {
    res.set({
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'max-age=' + Math.round((d.expire - Date.now()) / 1000)
    });
    res.json(d);
  });
});

module.exports = Router;