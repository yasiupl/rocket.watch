var RocketWatch = require('./server.js');
var Notify = require('./notifications.js');
var https = require("https");


RocketWatch.load("/launch/next/1?status=1", function(d) {
  console.log(d.launches[0])
});


/*
var Reddit = require('snoowrap');
var reddit = new Reddit({
  userAgent: 'rocketwatch',
  clientId: 'UqjVuPO_IWcXfQ',
  clientSecret: 'l736J1TxV794CZ2_uQjW6BT9lio',
  username: 'RocketWatchBOT',
  password: 'f72JWeELEwJsuT'
});


reddit.getSubmission("7ztfpp").reply("*bleep blop* \n\n Watch this launch live on [**Rocket Watch**](https://rocketwatch.yasiu.pl/?id=1387&utm_source=reddit&utm_campaign=comment)! 🚀\n\n ---\n*[^^TV ^^mode](http://rocketwatch.yasiu.pl/?id=1387&mode=column&utm_source=reddit&utm_campaign=comment)* ^^| *[^^Countdown ^^only](http://rocketwatch.yasiu.pl/?id=1387&mode=countdown&utm_source=reddit&utm_campaign=comment)* ^^| [^^Discord](https://discordapp.com/invite/5b8Xhny) ^^| [^^Contact ^^my ^^maker](/message/compose/?to=/r/RocketWatch)");
*/
