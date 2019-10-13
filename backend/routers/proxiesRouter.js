var express = require("express");
var Router = express.Router();
const keys = require("../config.json");
const webrequest = require("request");

const routes = [
  {
    slug: "/logo/*",
    url: "https://logo.clearbit.com/",
    suffix: ""
  },
  {
    slug: "/flag/*",
    url: "https://restcountries.eu/data/",
    suffix: ".svg"
  },
  {
    slug: "/map/*",
    url: "https://maps.googleapis.com/maps/api/staticmap",
    suffix: "&key=" + keys.google
  },
  {
    slug: "/rocketimg/*",
    url: "https://s3.amazonaws.com/launchlibrary/RocketImages/",
    suffix: ""
  }
];

const proxy = route =>
  Router.route("/api" + route.slug).get((request, response) =>
    webrequest(
      route.url + request.url.split(route.slug.split("*")[0])[1] + route.suffix
    ).pipe(response)
  );

routes.forEach(route => proxy(route));
module.exports = Router;
