const Storage = require("node-storage");
const request = require("request");

const agencyType = require("./src/scrape/agencyType.js")
const agencyShortName = require("./src/scrape/agencyShortName.js")

const config = require("./config.json");
const sources = require("./data/sources.json");
const storage = new Storage("./cache.json");

const envargs = process.argv.slice(2);



function load(query, callback) {
  callback = callback || function () {};
  var queryParams = QueryString(query);
  var query = query.replace(/(\?|&)(page=)([0-9])/g, "");
  var format = queryParams.format || "undefined";
  var mode = queryParams.mode || "undefined";

  var cache = storage.get(query);

  if (!cache || (cache && Date.now() - cache.expire > 0)) {
    if(format.match("custom")) {
      const data = require(`./data/custom/${query.split("?")[0]}.json`);
      processData(data, query, callback);
    } else {
      getJSON(config.launchlibraryURL + query).then(data => {
        if (data.status >= 500) {
          if (data) {
            console.log(query);
            console.log(
              "Failed to request, Serving cache " + format + "|" + query
            );
            callback(cache);
          } else {
            console.error(query);
            console.error("Database connection failed " + data.status);
          }
        } else {
          processData(data, query, callback);
        }
      });
    }
  } else callback(cache);
}

async function processData(data, query, callback) {
  try {
    var queryParams = QueryString(query);
    var query = query.replace(/(\?|&)(page=)([0-9])/g, "");
    var format = queryParams.format || "undefined";
    var mode = queryParams.mode || "undefined";

    //default expire time is 24h
    data.expire = Date.now() + 86400000;

    // override /rocket
    for (var g in data.rockets) {
      f = processRocket(data.rockets[g]);

      if (mode.match("verbose")) {
        await getJSON(
          "https://spacelaunchnow.me/3.0.0/launchers/" + f.id + "/?format=json"
        ).then(data => {
          if (!data.detail) {
            f.description = data.description || "";
            f.img = data.image_url;
            f.agency.name = data.agency.name;
            f.agency.abbrev = data.agency.abbrev;
            f.agency.shortname =
              data.agency && data.agency.name.length > 11 ?
              data.agency.abbrev :
              data.agency.name;
            f.agency.type = data.agency.type;
            f.agency.countryCode = data.agency.country_code;
            f.agency.countryFlag =
              config.deploymentURL + "flag/" +
              data.agency.country_code.split(",")[0].toLowerCase();
            f.agency.info = data.agency.info_url;
            f.agency.wiki = data.agency.wiki_url;
            f.agency.icon = data.agency.logo_url;
          }
        });
      }

      data.rockets[g] = f;
    }

    // override /pad
    for (var g in data.pads) {
      data.pads[g] = processPad(data.pads[g]);
    }

    // override /location
    for (var g in data.locations) {
      data.locations[g] = processLocation(data.locations[g]);
    }

    // override /agency
    for (var g in data.agencies) {
      f = processAgency(data.agencies[g]);
      // just news

      if (format.match("news")) {
        // 1h
        data.expire = Date.now() + 600000;
        f.news = {};

        if (f.social.reddit) {
          await getJSON(
            "https://www.reddit.com/r/" + f.social.reddit + ".json?limit=5"
          ).then(q => {
            f.news.reddit = f.news.reddit || [];
            for (var r in q.data.children) {
              f.news.reddit.push({
                title: q.data.children[r].data.title,
                content: "",
                url: "https://www.reddit.com" + q.data.children[r].data.permalink,
                img: q.data.children[r].data.preview &&
                  q.data.children[r].data.preview.images[0].source.url ?
                  q.data.children[r].data.preview.images[0].source.url :
                  ""
              });
            }
          });
        }
      }

      if (mode.match("verbose")) {
        await getJSON(
          "https://spacelaunchnow.me/3.0.0/agencies/" + f.id + "/?format=json"
        ).then(data => {
          f.description = data.description || "";
          f.icon = data.logo_url || f.icon;
          f.founded = data.founding_year || "Unknown";
          f.rockets = data.launcher_list;
        });
      }

      data.agencies[g] = f;
    }

    // override /launch
    for (var g in data.launches) {
      var f = data.launches[g];

      f.name = f.name.split("|")[0] + "|" + f.name.split("|")[1].split(" (")[0];
      f.statuscode = f.status;

      switch (f.statuscode) {
        case 1:
          f.status = "GO for launch";
          break;
        case 2:
          f.status = "To Be Determined";
          if (f.tbdtime) {
            f.status = "Time To Be Determined";
          }
          if (f.tbddate) {
            f.status = "Date To Be Determined";
          }
          break;
        case 3:
          f.status = "Launch successful";
          break;
        case 4:
          f.status = "Launch failed";
          break;
        case 5:
          f.status = "Hold";
          break;
        case 6:
          f.status = "In Flight";
          break;
        case 7:
          f.status = "Partial Failure";
          break;
        default:
          f.status = "NO-GO for launch";
      }

      f.mission = f.name.split("| ")[1].replace("SpX ", "");
      f.tolaunch = Math.floor((Date.parse(f.net) - Date.now()) / 1000);

      //verbose

      if (f.missions && f.missions[0]) {
        f.mission = f.missions[0].name.split(" (")[0];
        f.name = f.rocket.name + " | " + f.mission;
      }

      f.description =
        f.failreason ||
        f.holdreason ||
        (f.missions && f.missions[0] && f.missions[0].description) ||
        "";

      if (
        (f.lsp && typeof f.lsp === "object") ||
        (f.rocket && f.rocket.agencies) ||
        (f.location && f.location.pads)
      ) {
        f.agency = processAgency(
          f.lsp ||
          f.rocket.agencies[0] ||
          (f.location.pads[0] && f.location.pads[0].agencies[0])
        );
        delete f.lsp;
      }

      if (f.rocket) {
        f.rocket = processRocket(f.rocket);
      }

      if (f.location) {
        f.location.countryFlag =
          config.deploymentURL + "flag/" +
          (
            f.location.countryCode ||
            (f.location.pads[0] &&
              f.location.pads[0].agencies[0] &&
              f.location.pads[0].agencies[0].countryCode)
          ).toLowerCase();
        f.location.img =
          config.deploymentURL + "map/?zoom=16&maptype=satellite&size=128x128&scale=1&center=" +
          f.location.pads[0].latitude +
          "," +
          f.location.pads[0].longitude;
        f.location.info = (
          f.location.pads[0].infoURL ||
          f.location.pads[0].wikiURL ||
          f.location.infoURL ||
          f.location.wikiURL ||
          ""
        ).replace("http://", "https://");
        f.location.map =
          "https://www.google.com/maps/embed/v1/place?key=" +
          config.keys.google +
          "&maptype=satellite&q=" +
          f.location.pads[0].latitude +
          "," +
          f.location.pads[0].longitude;
      }

      f.img = null;
      if (format.match("live")) {
        f.media = {
          badge: [],
          button: [],
          audio: [],
          video: [],
          photo: [],
          tweets: [],
          info: [],
          comments: [],
          last: [],
          twitter: []
        };

        addSource = async function (name, url, fallback) {
          url = (url || "").replace("http://", "https://");

          if (url.match(".reddit.com/r/")) {
            f.media.comments.push({
              name: "[Reddit] &nbsp; &nbsp; " + name,
              embed: "https://reddit-stream.com/comments/" +
                (url.split("/comments/")[1] || url),
              share: "https://reddit.com/comments/" +
                (url.split("/comments/")[1] || url)
            });
          } else {
            if (url.match("reddit.com/live/")) {
              f.media.comments.push({
                name: "[Reddit] &nbsp; &nbsp; " + name,
                embed: "https://www.redditmedia.com/live/" +
                  url.split("reddit.com/live/")[1].split("/")[0] +
                  "/embed",
                share: url
              });
            } else {
              if (
                url.match("youtube.com") ||
                url.match("livestream.com") ||
                url.match("dailymotion.com") ||
                (url.match("streamable.com") &&
                  !url.match("streamable.com/s/")) ||
                url.match(".mp4")
              ) {
                f.media.video.unshift({
                  name: "[YouTube] " + name,
                  embed: url
                    .replace("/watch?v=", "/embed/")
                    .replace(
                      "www.dailymotion.com/video/",
                      "www.dailymotion.com/embed/video/"
                    )
                    .replace("streamable.com/", "streamable.com/s/")
                    .split("&")[0],
                  share: url
                });
              } else {
                if (url.match("imgur.com")) {
                  f.media.photo.push({
                    name: "[Imgur] &nbsp; &nbsp; " + name,
                    embed: "https://imgur.com/" +
                      url
                      .match(
                        /(https?:\/\/(?:i\.|)imgur\.com(?:\/(?:a|gallery)|)\/(.*?)(?:[#\/].*|$))/
                      )[2]
                      .split(".")[0] +
                      "/embed",
                    share: url
                  });
                } else {
                  if (url.match(".mp3")) {
                    f.media.audio.push({
                      name: name,
                      embed: url
                    });
                  } else {
                    if (url.match(".twitter.com/")) {
                      if (
                        !url.match("/status/") && [3, 4, 7].indexOf(f.statuscode) == -1
                      ) {
                        f.media.twitter.push({
                          name: name || "Twitter",
                          url: url
                        });
                      } else {
                        f.media.tweets.push({
                          name: "[Tweet] &nbsp; &nbsp; " + name,
                          embed: "https://projects.yasiu.pl/twitterembed/?url=" +
                            url,
                          share: url
                        });
                      }
                    } else {
                      if (url.match("archive.org/details/")) {
                        f.media.video.push({
                          name: "[Video]  WebArchive.org footage",
                          embed: url.replace(
                            "archive.org/details/",
                            "archive.org/embed/"
                          ),
                          share: url
                        });
                      } else if (
                        fallback &&
                        !RegExp(
                          custom[v].url
                          .split("//")[1]
                          .replace("www.", "")
                          .split("/")[0]
                        ).test(sources.embed_blacklist)
                      ) {
                        fallback();
                      }
                    }
                  }
                }
              }
            }
          }
        };

        // generic info

        if (f.probability != "-1" && [3, 4, 7].indexOf(f.statuscode) == -1) {
          f.media.badge.push({
            name: f.probability + "% probability",
            desc: "Launch probability"
          });
        }

        var custom = (sources.norminal.media || []).concat(sources.custom.byMissionName[f.mission] || [])
          .concat(sources.custom.byMissionId[f.id] || [])
          .concat(sources.custom.byLocationID[f.location.id] || [])
          .concat(
            sources.custom.byAgencyAbbrev[f.agency.abbrev.toLowerCase()] || []
          );

        for (var v in custom) {
          if (
            custom[v].when == undefined ||
            (custom[v].when.match("live") && [3, 4, 7].indexOf(f.statuscode) == -1 &&
              f.tolaunch < 7200) ||
            (custom[v].when.match("go") && [3, 4, 7].indexOf(f.statuscode) == -1) ||
            (custom[v].when.match("recovery") && format.match("recovery"))
          ) {
            if (custom[v].is && f.media[custom[v].is]) {
              f.media[custom[v].is].push(
                Object.assign({}, {
                    name: custom[v].name || "Source #" + v,
                    embed: custom[v].embed || custom[v].url,
                    share: custom[v].share || custom[v].url
                  },
                  custom[v]
                )
              );
            } else {
              addSource(
                custom[v].name,
                custom[v].url || custom[v].embed || custom[v].share,
                function () {
                  f.media.info.push({
                    name: custom[v].name,
                    embed: custom[v].embed || custom[v].url,
                    share: custom[v].share || custom[v].url
                  });
                }
              );
            }
          }
        }

        if (f.agency.abbrev == "SpX") {
          // r/SpaceX API bridge

          await getJSON(
            "https://api.spacexdata.com/v2/launches" +
            (f.tolaunch > 0 ? "/upcoming" : "") +
            "?start=" +
            (new Date(Date.parse(f.net) - 86400000)).toISOString().split("T")[0] +
            "&final=" +
            (new Date(Date.parse(f.net) + 86400000)).toISOString().split("T")[0]
          ).then(d => {
            var data = d[0];
            if (data) {
              if (data.reuse.core) {
                f.media.badge.push({
                  img: "https://rocket.watch/res/reuse.png",
                  name: "Reused booster"
                });
              }
              if (data.reuse.capsule) {
                f.media.badge.push({
                  img: "https://rocket.watch/res/reuse.png",
                  name: "Reused capsule"
                });
              }
              if (data.links.reddit_launch) {
                var id = data.links.reddit_launch
                  .split("/comments/")[1]
                  .split("/")[0];
                f.media.comments.unshift({
                  name: "r/SpaceX Launch Thread",
                  embed: "https://reddit-stream.com/comments/" + id,
                  share: "https://reddit.com/comments/" + id
                });
              } else if (data.links.reddit_campaign) {
                var id = data.links.reddit_campaign
                  .split("/comments/")[1]
                  .split("/")[0];
                f.media.comments.unshift({
                  name: "r/SpaceX Campaign Thread",
                  embed: "https://reddit-stream.com/comments/" + id,
                  share: "https://reddit.com/comments/" + id
                });
              }
              if (data.links.mission_patch) {
                f.img = data.links.mission_patch;
              }
            }
          });

          // Flightclub.io bridge

          await getJSON(
            "https://www.flightclub.io:8443/FlightClub/api/v1/missions/?display=true"
          ).then(q => {
            for (var r in q.data) {
              if (
                q.data[r].datetime.replace(/-/gi, "").split("T")[0] ==
                f.isostart.split("T")[0]
              ) {
                if (f.tolaunch < 3600) {
                  f.media.video.unshift({
                    is: "video",
                    name: "Flightclub.io LIVE flight simulation",
                    embed: "https://www.flightclub.io/live?w=1&code=" +
                      q.data[r].code,
                    share: "https://www.flightclub.io/result?tab=2&code=" +
                      q.data[r].code
                  });
                }
                f.media.video.unshift({
                  is: "video",
                  name: "Flightclub.io flight simulation",
                  embed: "https://www.flightclub.io/live?w=2&code=" + q.data[r].code,
                  share: "https://www.flightclub.io/result?tab=2&code=" +
                    q.data[r].code
                });
                f.media.button.push({
                  name: "Flightclub.io",
                  url: "https://www.flightclub.io/result?tab=2&code=" +
                    q.data[r].code
                });
                break;
              }
            }
          });
        }

        await getJSON(
          "https://www.reddit.com/r/" +
          (f.agency.social.reddit || sources.norminal.reddit) +
          "/search.json?sort=relevance&restrict_sr=on&q=" + encodeURIComponent(f.mission)
        ).then(r => {
          if (r && r.data) {
            for (var q in r.data.children) {
              if (
                !(
                  r.data.children[q].data.created_utc * 1000 <
                  Date.parse(f.windowend)
                ) &&
                f.statuscode == 3
              ) {
                continue;
              }
              if (r.data.children[q].data.num_comments > 0) {
                f.media.comments.push({
                  name: "[Reddit] &nbsp; &nbsp; " + r.data.children[q].data.title,
                  embed: "https://reddit-stream.com/comments/" +
                    r.data.children[q].data.id,
                  share: "https://reddit.com/comments/" + r.data.children[q].data.id
                });
              }
              if (!r.data.children[q].data.is_self) {
                addSource(
                  r.data.children[q].data.title,
                  r.data.children[q].data.url
                );
              }
            }
          }
        });

        if (f.vidURLs.length) {
          f.vidURLs.reverse();
          for (var v in f.vidURLs) {
            var url = f.vidURLs[v];
            if (url.split("?v=")[1] != undefined) {
              f.media.video.unshift({
                name: "YouTube feed #" + v,
                embed: "https://www.youtube.com/embed/" +
                  url.split("?v=")[1] +
                  "?rel=0&autoplay=1",
                share: "https://www.youtube.com/watch?v=" + url.split("?v=")[1]
              });
            } else if (
              !url.match("/c/") &&
              !url.match("/user/") &&
              !url.match("/channel/")
            ) {
              addSource(url.split("://")[1].split("/")[0], url);
            }
          }
        }


        if ([3, 4, 7].indexOf(f.statuscode) == -1 && f.tolaunch > 0) {
          if (f.location.countryCode == "USA") {

            await getJSON("https://forecast.weather.gov/MapClick.php?unit=1&lat=" + f.location.pads[0].latitude + "&lon=" + f.location.pads[0].longitude + "&FcstType=json").then(r => {
              if (r && r.currentobservation && r.currentobservation.name) {
                f.media.comments.push({
                  name: "[Weather] " + r.currentobservation.name + " weather forecast",
                  embed: "https://forecast.weather.gov/MapClick.php?lat=" + f.location.pads[0].latitude + "&lon=" + f.location.pads[0].longitude,
                  share: "https://forecast.weather.gov/MapClick.php?lat=" + f.location.pads[0].latitude + "&lon=" + f.location.pads[0].longitude
                });
                f.media.comments.push({
                  name: "[Weather] " + r.currentobservation.name + " radar imagery",
                  embed: "https://radar.weather.gov/lite/N0R/" + r.location.radar.split("K")[1] + "_loop.gif",
                  share: r.credit
                });
              }
            })
          }
          // Mixed content without working proxy
          /*

          await getJSON(`https://api.weather.gov/points/${f.location.pads[0].latitude},${f.location.pads[0].longitude}`).then(r => { 
            if (r && r.status != 404) {
                f.media.comments.push({
                  name: `[Weather] ${r.properties.relativeLocation.properties.city}, ${r.properties.relativeLocation.properties.state} weather forecast`,
                  embed: `https://forecast.weather.gov/MapClick.php?lat=${f.location.pads[0].latitude}&lon=${f.location.pads[0].longitude}`,
                  share: `https://forecast.weather.gov/MapClick.php?lat=${f.location.pads[0].latitude}&lon=${f.location.pads[0].longitude}`
                });
                f.media.comments.push({
                  name: `[Weather] ${r.properties.radarStation} radar imagery`,
                  embed: `https://radar.weather.gov/lite/N0R/${r.properties.radarStation.split("K")[1]}_loop.gif`,
                  share: r.credit
                });
              }
            })

          if (f.location.id == 9) {
            f.media.comments.push({
              name: "[Weather] JAXA TNSC Daily weather forecast",
              embed: config.deploymentURL + "proxy/http://space.jaxa.jp/tnsc/tn-weather/data/daily.gif",
              share: "http://space.jaxa.jp/tnsc/tn-weather/"
            });
            f.media.comments.push({
              name: "[Weather] JAXA TNSC Weekly weather forecast",
              embed: config.deploymentURL + "proxy/http://space.jaxa.jp/tnsc/tn-weather/data/weekly.gif",
              share: "http://space.jaxa.jp/tnsc/tn-weather/"
            });
          }
          */
        }

        if (f.agency.social.reddit) {
          f.media.button.push({
            name: "/r/" + f.agency.social.reddit + " subreddit",
            url: "https://www.reddit.com/r/" + f.agency.social.reddit
          });
        }
      }

      if (format.match("stats")) {
        data.stats = data.stats || {};
        data.stats.byStatus = data.stats.byStatus || {};
        data.stats.byStatus[f.statuscode] =
          data.stats.byStatus[f.statuscode] || [];
        data.stats.byStatus[f.statuscode].push(f.id);
        data.stats.byYear = data.stats.byYear || {};

        data.rockets = data.rockets || [];
        var rocket = f.name.split(" |")[0].replace("(?)", "");

        if (
          !data.rockets.find(function (a) {
            if (typeof a == "object") {
              return a.name.match(rocket);
            } else {
              return a.match(rocket);
            }
          }) ||
          0
        ) {
          data.rockets.push(f.rocket || f.name.split(" |")[0]);
        }

        //BUG: NIE MAM POJĘCIA JAK TO DZIAŁA
        var b = new Date(data.launches[g].net);
        if (!data.stats.byYear[b.getUTCFullYear()]) {
          for (
            i = b.getUTCFullYear(); i < new Date().getUTCFullYear() + 1; i++
          ) {
            data.stats.byYear[i] = data.stats.byYear[i] || {
              "1": 0,
              "2": 0,
              "3": 0,
              "4": 0
            };
            if (i == b.getUTCFullYear()) {
              data.stats.byYear[b.getUTCFullYear()][f.statuscode]++;
            }
          }
        } else {
          data.stats.byYear[b.getUTCFullYear()][f.statuscode]++;
        }
      }

      if (f.tolaunch < 86400 && f.tolaunch > -86400) {
        //10 minutes
        data.expire = Date.now() + 10 * 60 * 1000;
        if (f.tolaunch < 3600 && f.tolaunch > -3600) {
          //1 minute
          data.expire = Date.now() + 60 * 1000;
        }
      }
      if (query.match("/next/")) {
        data.expire = Date.now() + 60 * 1000;
      }
    }

    if (envargs.indexOf("dev") == -1) storage.put(query, data);
    callback(data);
    return data;
  } catch (error) {
    console.log(error);
  }
}

function processAgency(data) {
  var data = data || {};
  modelAgency = {
    id: data.id || -1,
    name: data.name || "Unknown",
    abbrev: (data.abbrev && data.abbrev.split("-")[0]) || "UNK",
    shortname: data.name && data.name.length > 11 ? data.abbrev : data.name || "UNK",
    description: "",
    founded: "",
    type: agencyType(data.type),
    typeCode: data.type || -1,
    islsp: data.islsp || 0,
    countryCode: data.countryCode || "UNK",
    countryFlag: config.deploymentURL + "flag/" +
      data.countryCode.split(",")[0].toLowerCase(),
    info: data.infoURL || (data.infoURLs && data.infoURLs[0]) || "",
    wiki: (data.wikiURL || "").replace("http://", "https://"),
    icon: data.infoURL || (data.infoURLs && data.infoURLs[0]) ?
      config.deploymentURL + "logo/" + (data.infoURL || data.infoURLs[0]) :
      "",
  };
  if (!data) return modelAgency;
  if (modelAgency.countryCode.split(",").length > 1) {
    modelAgency.countryCode = agencyType(modelAgency.typeCode);
    modelAgency.countryFlag = "https://rocket.watch/res/multinational.png";
  }
  modelAgency.social = {};
  modelAgency.social.youtube = (
    data.infoURLs.find(function (a) {
      return a.match("youtube.com/channel/");
    }) || ""
  ).split("youtube.com/channel/")[1];
  modelAgency.social.facebook = (
    data.infoURLs.find(function (a) {
      return a.match("facebook.com/");
    }) || ""
  ).split("facebook.com/")[1];
  modelAgency.social.twitter = (
    data.infoURLs.find(function (a) {
      return a.match("twitter.com/");
    }) || ""
  ).split("twitter.com/")[1];
  modelAgency.social.reddit =
    sources.company[modelAgency.abbrev.toLowerCase()] &&
    sources.company[modelAgency.abbrev.toLowerCase()].reddit;

  return modelAgency;
}

function processRocket(data) {
  modelRocket = {
    id: data.id || -1,
    name: data.name || "Unknown",
    info: data.infoURL || (data.infoURLs && data.infoURLs[0]) || "",
    wiki: (data.wikiURL || "").replace("http://", "https://"),
    img: (data.imageURL || "").replace(
      "https://s3.amazonaws.com/launchlibrary/RocketImages/placeholder_1920.png",
      ""
    ),
    icon: (data.imageURL || "")
      .replace(
        "https://s3.amazonaws.com/launchlibrary/RocketImages/placeholder_1920.png",
        ""
      )
      .replace("2560", "320")
      .replace("1920", "320")
      .replace("1440", "320")
      .replace("1280", "320")
      .replace("1440", "320")
      .replace("1080", "320")
      .replace("1024", "320")
      .replace("960", "320")
      .replace("800", "320")
      .replace("768", "320")
      .replace("720", "320")
      .replace("640", "320")
      .replace("480", "320"),
    family: {
      id: (data.family && (data.family && data.family.id)) || -1,
      name: data.familyname || (data.family && data.family.name) || "Unknown",
      agencies: data.agencies || [{
        id: -1,
        name: "Unknown"
      }]
    },
    agency: {
      id: -1,
      name: "Unknown"
    }
  };

  if (data.family) {
    data.family.agencies =
      (data.family.agencies && data.family.agencies.split(",")) || {};
    for (var i in data.family.agencies) {
      modelRocket.family.agencies[i] = {
        id: parseInt(data.family.agencies[i]) || -1,
        name: agencyShortName(data.family.agencies[i])
      };
    }
  }

  modelRocket.agency = modelRocket.family.agencies[0] || {
    id: -1,
    name: "Unknown"
  };
  return modelRocket;
}

function processPad(data) {
  modelPad = {
    id: data.id || -1,
    name: data.name || "Unknown",
    info: data.infoURL || (data.infoURLs && data.infoURLs[0]) || "",
    wiki: (data.wikiURL || "").replace("http://", "https://"),
    map: "https://www.google.com/maps/embed/v1/place?key=" +
      config.keys.google +
      "&maptype=satellite&q=" +
      data.latitude +
      "," +
      data.longitude,
    img: config.deploymentURL + "map/?zoom=16&maptype=satellite&size=256x256&scale=1&center=" +
      data.latitude +
      "," +
      data.longitude,
    icon: config.deploymentURL + "map/?zoom=16&maptype=satellite&size=128x128&scale=1&center=" +
      data.latitude +
      "," +
      data.longitude,
    agency: {
      id: -1,
      name: "Unknown"
    }
  };
  if (data.agencies && typeof data.agencies[0] === "object") {
    //modelPad.agencies = data.agencies;
    modelPad.agency = processAgency(data.agencies[0]);
  }
  return modelPad;
}

function processLocation(data) {
  modelLocation = {
    id: data.id || -1,
    name: data.name || "Unknown",
    countryCode: data.countrycode || "UNK",
    countryFlag: config.deploymentURL + "flag/" +
      data.countrycode.split(",")[0].toLowerCase(),
    map: "https://www.google.com/maps/embed/v1/place?key=" +
      config.keys.google +
      "&maptype=satellite&q=Launch+Centre+" +
      data.name.replace(" ", "+"),
    img: config.deploymentURL + "map/?zoom=16&maptype=satellite&size=128x128&scale=1&center=Launch+Centre+" +
      data.name.replace(" ", "+"),
    info: data.infoURL || data.infoURLs[0] || "",
    wiki: (data.wikiURL || "").replace("http://", "https://")
  };
  return modelLocation;
}

function QueryString(url, callback) {
  var g = {};
  var l = (url && url.split("?")[1]) || "";
  var k = l.split("&");
  for (var m = 0; m < k.length; m++) {
    var j = k[m].split("=");
    if (typeof g[j[0]] === "undefined") {
      g[j[0]] = decodeURIComponent(j[1]);
    } else {
      if (typeof g[j[0]] === "string") {
        var h = [g[j[0]], decodeURIComponent(j[1])];
        g[j[0]] = h;
      } else {
        g[j[0]].push(decodeURIComponent(j[1]));
      }
    }
  }
  if (callback) callback(g);
  return g;
}

function getJSON(url) {
  return new Promise((resolve, reject) => {
    request({
        url: url,
        json: true,
        headers: {
          'User-Agent': 'rocket.watch'
        }
      },
      function (error, response, body) {
        if (error) reject(error);
        resolve(body);
      }
    );
  });
}

module.exports = {
  load: load,
  storage: storage
};