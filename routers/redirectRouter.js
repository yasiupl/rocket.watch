const { Router } = require("express");

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

const router = Router()
routes.forEach(x => router.get(x.slug, (request, response) => response.redirect(301, x.url)))

// TODO: How to test this?

module.exports = router;
