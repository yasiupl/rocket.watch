const { Router } = require("express");

//redirects client to another location on the internet

const routes =
    [
        {
            "slug": "/discord",
            "url": "https://discord.gg/cExSaKZ",
        },
        {
            "slug": "/reddit",
            "url": "https://reddit.com/r/rocketwatch",
        },
        {
            "slug": "/youtube",
            "url": "https://www.youtube.com/channel/UCpY48ts_nCvlBRAVlbJePgg",
        },
        {
            "slug": "/android",
            "url": "https://play.google.com/store/apps/details?id=pl.yasiu.rocketwatch",
        },
    ];

const redirect =
    (router, route) =>
        router.get(route.slug, (request, response) => response.redirect(301, route.url));

module.exports = routes.reduce(redirect, Router())
