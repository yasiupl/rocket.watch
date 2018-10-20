var { Router } = require('express');
const request = require("request");
const keys = require("../keys.json");

//proxies requests through the server, allowing for making CORS requests
//TODO: add rate limiting?

const routes =
    [
        {
            "slug": "/res/logo/*",
            "url": "https://logo.clearbit.com/"
        },
        {
            "slug": "/res/flag/*",
            "url": "https://restcountries.eu/data/"
        },
        {
            "slug": "/res/rocket/*",
            "url": "https://s3.amazonaws.com/launchlibrary/RocketImages/",
        },
        {
            "slug": "/res/map/*",
            "url": "https://maps.googleapis.com/maps/api/staticmap",
            "params": "&key=" + keys.google
        },
        {
            "slug": "/js/notifications.js",
            "url": "https://cdn.onesignal.com/sdks/OneSignalSDK.js",
        },
        {
            "slug": "/js/promotion.js",
            "url": "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js",
        },
        {
            "slug": "/js/analytics.js",
            "url": "https://www.google-analytics.com/analytics.js",
        },
        {
            "slug": "/js/vidpulse.js",
            "url": "https://s.vidpulse.com/all/vp.js",
        },
    ];

const url = (alias, req) => alias.url + req.url.split(alias.slug.split("*")[0])[1].toLowerCase() + (alias.params ? alias.params : "");

const proxy =
    (router, alias) =>
        router.get(alias.slug, (req, res) => request(url(alias, req)).pipe(res));

module.exports = routes.reduce(proxy, Router());