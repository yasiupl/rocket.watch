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

const redirect =
    router =>
        (slug, url) =>
            router.get(slug, (request, response) => response.redirect(301, url));

const router = Router();
routes.forEach(redirect(router))

module.exports = router;
