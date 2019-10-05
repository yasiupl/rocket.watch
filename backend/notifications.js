var RocketWatch = require("./server.js");
var https = require("https");
var lastloop = new Date();
var keys = require("./config.json").keys;

console.log(keys.onesignal)

module.exports = {
  onesignal: onesignal,
  twitter: twitter,
  reddit: reddit,
  discord: discord,
  all: all
};

setInterval(function() {
  //console.log("1 minute loop");
  RocketWatch.storage.remove("/launch/next/4?status=1");
  RocketWatch.load("/launch/next/4?status=1", function(next) {
    for (var i in next.launches) {
      all(next.launches[i]);
    }
    console.log("Loop delay: " + (Date.now() - lastloop.getTime()) / 1000);
  });

  lastloop = new Date();
}, 60001);

function all(data) {
  if (data.tbdtime != 1) {
    data.tolaunch = Math.floor((Date.parse(data.net) - Date.now()) / 1000);

    var message = {
      id: data.id,
      date: data.net,
      title: data.name,
      hashtag: (
        (data.hashtag || "") +
        " #" +
        (data.agency.name.match(" ")
          ? data.agency.abbrev
          : data.agency.name
        ).replace(" ", "")
      ).replace("-", ""),
      status:
        data.statuscode > 2
          ? data.failreason || data.status
          : data.holdreason || "",
      description: data.description || "",
      url: "https://rocket.watch/?id=" + data.id,
      img: data.rocket.img
    };

    if (data.tolaunch > 1170 && data.tolaunch < 1230) {
      message.status = "T- 20 minutes";
      message.tag = "t20";
      console.log(message.status);
      if (data.vidURLs.length) {
        onesignal(message);
      }
      twitter(message);
    }

    if (data.tolaunch > 3570 && data.tolaunch < 3630) {
      message.status = "T- 60 minutes";
      message.tag = "t60";
      console.log(message.status);
      if (data.vidURLs.length) {
        onesignal(message);
      }
      discord(message);
      twitter(message);
    }
    if (data.tolaunch > 43170 && data.tolaunch < 43230) {
      message.status = "L- 12 Hours";
      message.tag = "t24";
      console.log(message.status);
      twitter(message);
      onesignal(message);
    }

    if (data.tolaunch > 86370 && data.tolaunch < 86430) {
      message.status = "L- 24 Hours";
      message.tag = "t24";
      console.log(message.status);
      twitter(message);
      onesignal(message);
    }
  }

  /*

    var last = RocketWatch.storage.get("notification|" + data.id) || false;
    //var change = subtract(data, last);

    //console.log("Change")
    //console.log(change)

    // We operate T+/- one hour around liftoff.
    if (data.tbdtime != 1 && data.statuscode != 2 && data.tolaunch <= 3600) {
      if (data.tolaunch > 0) {
        if (last && last.net != data.net && data.notificationStatus == "init") {
          console.log("Updating " + data.name);
          message.type = "update";
          message.status = "New T-0 set to " + data.net;
          console.log(message.status);
          discord(message);
          //reddit(message);
        }

        if (data.tolaunch >= 1100 && data.tolaunch <= 1200) {
          console.log("Notifying " + data.name);
          data.notificationStatus = "init"
          console.log(message.status);
          discord(message);

          twitter(message);

          if (data.media.video.length) {
            onesignal(message);
          }

          if (!data.media.info.length && !last) {
            //reddit(message);
          }
        }
      } else if (last && data.statuscode != last.statuscode && (data.statuscode == 3 || data.statuscode == 4 || data.statuscode == 7) && last.notificationStatus != "final") {
        // assumes that no launch comes back from success / failure to green/red
        console.log("Final Update " + data.name);
        data.notificationStatus = "final";
        message.type = "update";
        message.status = data.status;
        console.log(message.status);
        discord(message);
        twitter(message);
        //reddit(message);

        if (data.media.video.length) {
          onesignal(message);
        }
      }
      RocketWatch.storage.put("notification|" + data.id, data);
    }

  */
  //console.log(message);
  /*
  console.log(((Date.parse(last.net || 0)) - Date.parse(data.net)))

  if (data.tbdtime != 1 && data.tolaunch <= 3600) {

    if (data.tolaunch > 0) {
      if (last.net != data.net && data.notificationStatus) {
        console.log("Updating " + data.name);
        message.type = "update";
        message.status = "New T-0 set to " + data.net;
        discord(message);
        //reddit(message);
      } else if (((Date.parse(last.net || 0)) - Date.parse(data.net)) < 3600000) {
        console.log("Notifying " + data.name);
        data.notificationStatus = "init"
        discord(message);

        //twitter(message);

        if (data.media.video.length) {
          //onesignal(message);
        }

        if (!data.media.info.length && !last) {
          //reddit(message);
        }

      }
    } else if (data.statuscode >= 3 && data.statuscode != last.statuscode && !data.inhold && last.notificationStatus != "final") {
      // assumes that no launch comes back from success / failure to green/red
      console.log("Final Update " + data.name);
      data.notificationStatus = "final"
      message.type = "update";
      message.status = data.status;
      discord(message);

      //reddit(message);

      if (data.media.video.length)
        //onesignal(message);


    }
  }
  */
}

function onesignal(data) {
  message = {
    app_id: "d15cb12b-085c-4f0b-a40a-45dbdcba9e7c",
    contents: {
      en: `${data.status} ${data.description}`
    },
    headings: {
      en: data.title
    },
    filters: [
      { field: "tag", key: "All Launches", relation: "!=", value: "false" },
      { field: "tag", key: "All Launches", relation: "!=", value: "0" }
    ],
    url: `${data.url}&utm_source=onesignal&utm_medium=notification&utm_campaign=${data.id}`,
    chrome_web_image: data.img,
    large_icon: data.img,
    collapse_id: data.id
  };

  if (Date.parse(data.date) > Date.now()) {
    if (Date.now() > Date.parse(data.date) + 20 * 60 * 1000) {
      message.send_after = new Date(data.date + 20 * 60 * 1000);
    } else {
      message.send_after = new Date();
    }
  } else {
    message.delayed_option = "last-active";
  }

  var headers = {
    "Content-Type": "application/json; charset=utf-8",
    Authorization: "Basic " + keys.onesignal
  };
  var options = {
    host: "onesignal.com",
    path: "/api/v1/notifications",
    method: "POST",
    headers: headers
  };
  var req = https.request(options, function(res) {
    var data = [];
    res.on("data", function(chunk) {
      data.push(chunk);
      //console.log(chunk)
    });
    res.on("end", function() {
      var buffer = Buffer.concat(data);
      //console.log(buffer.toString());
    });
    req.on("error", function(e) {
      var buffer = Buffer.concat(data);
      //console.log(buffer.toString());
    });
  });

  req.write(JSON.stringify(message));
  req.end();
  //console.log(message);
}

function twitter(data) {
  //Twitter
  var Twitter = require("twitter");
  var twitter = new Twitter(keys.twitter);

  twitter.post(
    "statuses/update",
    {
      status: `${data.title}: ${data.status || "liftoff scheduled for" + data.date} #nextlaunch ${data.hashtag} ${data.url}&utm_source=twitter`
    },
    function(error, tweet, response) {
      if (error) {
        //console.log(JSON.stringify(response));
        throw error;
      }
    }
  );
}

function reddit(data, subreddit) {
  var Reddit = require("snoowrap");
  var reddit = new Reddit(keys.reddit);
  var subreddit = reddit.getSubreddit(subreddit || "rocketwatch");
  subreddit
    .search({
      query: data.title,
      sort: "top"
    })
    .then(function(d) {
      if (d.length && !data.type) {
        subreddit
          .submitSelfpost({
            title: data.title,
            text:
              data.description +
              "\n\n " +
              data.url +
              "&utm_source=reddit&utm_medium=post"
          })
          .sticky();
      }
    });
}

function discord(data) {
  var webhooks = keys.webhooks;

  for (var i in webhooks) {
    var message = {
      content: data.status,
      embeds: [
        {
          title: data.title,
          fields: [
            {
              name: "NET",
              value: data.date
            },
            {
              name: "Description",
              value: data.description
            },
            {
              name: "URL",
              value:`[Rocket Watch](${data.url}&utm_source=discord&utm_medium=${webhooks[i].split("/")[0]}&utm_campaign=${data.id}`,
            }
          ]
        }
      ]
    };

    var options = {
      hostname: "discordapp.com",
      port: 443,
      path: "/api/webhooks/" + webhooks[i],
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    };

    var req = https.request(options, function(res) {
      res.setEncoding("utf8");
      res.on("data", function(body) {
        //console.log('Body: ' + body);
      });
    });
    req.on("error", function(e) {
      console.log("problem with request: " + e.message);
    });
    // write data to request body
    req.write(JSON.stringify(message));
    req.end();
  }
}

function subtract(a, b) {
  var r = {};

  function isSame(a, b) {
    if (a.length != b.length) return false;
    if (
      a.filter(function(i) {
        return a.indexOf(i) < 0;
      }).length > 0
    )
      return false;
    if (
      b.filter(function(i) {
        return a.indexOf(i) < 0;
      }).length > 0
    )
      return false;
    return true;
  }

  // For each property of 'b'
  // if it's different than the corresponding property of 'a'
  // place it in 'r'
  for (var key in b) {
    if (Array.isArray(b[key])) {
      if (!a[key]) a[key] = [];
      if (!isSame(a[key], b[key])) r[key] = a[key];
    } else if (typeof b[key] == "object") {
      if (!a[key]) a[key] = {};
      r[key] = subtract(a[key], b[key]);
    } else {
      if (b[key] != a[key]) {
        r[key] = a[key];
      }
    }
  }
  return r;
}
