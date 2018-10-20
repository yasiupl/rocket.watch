const keys = require("../keys.json");

const toTest = [
    { input: "/js/notifications.js", expected: "https://cdn.onesignal.com/sdks/OneSignalSDK.js" },
    { input: "/res/logo/https://spacex.com", expected: "https://logo.clearbit.com/https://spacex.com" },
    { input: "/res/map/?zoom=16&maptype=satellite&size=256x256&scale=1&center=28.608389,-80.604333", expected: "https://maps.googleapis.com/maps/api/staticmap?zoom=16&maptype=satellite&size=256x256&scale=1&center=28.608389,-80.604333&key=" + keys.google }
]


async function test(one) {
    alias = one.input
    alias.url + req.url.split(alias.slug.split("*")[0])[1].toLowerCase() + (alias.params ? alias.params : "");

    if (response.request.res.statusCode !== 200) process.exit(0);
    if (index == array.length) process.exit(1)

}

toTest.reduce(test);
