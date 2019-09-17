console.log("rocket.watch");

const backendURL = "http://localhost:9000/api/"

if (localStorage.getItem("rocketwatch.Settings.v2")) {
  var $settings = JSON.parse(localStorage.getItem("rocketwatch.Settings.v2"));
  if ($settings.dark) {
    document.querySelector("body").className += " dark";
  }
} else {
  $oldsettings = JSON.parse(localStorage.getItem("rocketwatch.Settings") || "{}");
  var $settings = {
    dark: $oldsettings.dark || false,
    notifications_launches: $oldsettings.notifications_launches || true,
    notifications_launches_webcast: $oldsettings.notifications_launches_webcast || false,
    notifications_launches_24: $oldsettings.notifications_launches_24 || true,
    notifications_launches_60: $oldsettings.notifications_launches_60 || true,
    notifications_launches_20: $oldsettings.notifications_launches_20 || true,
    notifications_news: $oldsettings.notifications_news || true,
  };
  localStorage.setItem("rocketwatch.Settings.v2", JSON.stringify($settings))
}

var $info = document.getElementById("info");
var $main = document.getElementsByTagName("main")[0];
var $query = QueryString();
var countdowns = [];
var lastHash = -1;
window.addEventListener("hashchange", function () {
  var f;
  if (location.hash.length > 0) {
    f = parseInt(location.hash.replace("#", ""), 10)
  } else {
    f = 1
  }
  if (lastHash != f) {
    lastHash = f;
    reloadhash();
  }
});

(window.reloadhash = function () {

  document.getElementById("background").innerHTML = "";
  $info.innerHTML = '<div class="card-content"><h1 class="white-text" id="loading-message">Loading...</h1></div>';
  $main.innerHTML = '<div id="loading" style="height:500px"><div class="rocket"><div class="rocket-body"><div class="body"></div><div class="fin fin-left"></div><div class="fin fin-right"></div><div class="window"></div></div><div class="exhaust-flame"></div><ul class="exhaust-fumes"><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li></ul><ul class="star"><li></li><li></li><li></li><li></li><li></li><li></li><li></li></ul></div></div>';
  $main.className = "container";
  delete $main.id;

  for (var d in window.countdowns) {
    window.clearInterval(window.countdowns[d])
  }
  var tooltips = document.querySelectorAll('.material-tooltip');
  if (tooltips.length) {
    for (var i in tooltips) {
      if (i == (tooltips.length - 1)) break
      tooltips[i].parentElement.removeChild(tooltips[i]);
    }
  }
  document.title = "rocket.watch";
  window.scrollTo(0, 0);
  document.querySelector('.sidenav').style.transform = "translateX(-105%)";
  if (document.querySelector('.sidenav-overlay'))
    document.querySelector('.sidenav-overlay').style.display = "none";



  QueryString(function (b) {
    window.$query = QueryString();
    launched = 0;
    ask4consent(function () {
      if (b.id) {
        watch(b.id);
        launched++
      }
      if (b.event) {
        watch(b.event, "customlive");
        launched++
      }
      if (b.agency) {
        agency(b.agency);
        launched++
      }
      if (b.pad) {
        pad(b.pad);
        launched++
      }
      if (b.location) {
        launchcentre(b.location);
        launched++
      }
      if (b.rocket) {
        rocket(b.rocket);
        launched++
      }
      if (b.search) {
        search(b.search);
        launched++
      }
      if (b.collection) {
        search(b.collection + '&sort=asc');
        launched++
      }
      if (b.country) {
        nation(b.country);
        launched++
      }
      if (b.history) {
        timeline(1, b.history || b.page || 1);
        launched++
      }
      if (b.future) {
        timeline(0, b.future || b.page || 1);
        launched++
      }
      if (b.settings) {
        settings();
        launched++
      }
      if (!launched) {
        home();
      }
    }, function () {
      home();
    });

    if (navigator.onLine) {
      setTimeout(function () {
        if (document.getElementById("loading-message"))
          document.getElementById("loading-message").innerHTML = '<h1>Hold on.</h1><h5 style="cursor: pointer;" onclick="location.reload(true)">Try again</h5>'
      }, 6000);
    } else {
      document.getElementById("loading-message").innerHTML = '<h1>You\'re offline</h1><h5>Check your internet connection</h5>';
    }
    //window.history.pushState(undefined, undefined, (location.search || location.hash).replace("#", "?"));
  });

})();

function home() {
  //Materialize.toast('<span>We are testing Google Auto Ads site-wide. Please share your feedback </span><a class="btn-flat toast-action" id="intercom_chat" href="mailto:rocket-watch.intercom-mail.com">here</a>', 1000);
  var total = 0;
  $main.innerHTML = '';
  $upcoming = document.createElement("div");
  $upcoming.style = "padding: 0 !important";
  $main.appendChild($upcoming);

  $successful = document.createElement("div");
  $successful.style = "padding: 0 !important";
  $main.appendChild($successful);
  $featured = document.createElement("div");
  $featured.id = "featured";
  $featured.style = "padding: 0 !important";
  $main.appendChild($featured);

  refreshHome = function () {
    for (var d in window.countdowns) {
      window.clearInterval(window.countdowns[d]);
    }
    home()
  }

  load("launch/next/4?status=1,5,6", function (f) {
    if (f.launches && f.launches.length) {
      for (var a in f.launches.reverse()) {
        var g = f.launches[a];
        if (g.statuscode == 1 || g.statuscode == 6) {
          new Countdown(g.net, "countdown" + g.id)
        }

        $info.innerHTML = '<div id="video"></div><div class="card-content"><h1><a class="tooltipped" data-tooltip="More Info" href="/#rocket=' + g.rocket.id + '">' + g.name.replace("|", "</a>|") + '</h1><h3 id="countdown' + g.id + '">' + g.status + '</h3><div id="chips"><a class="chip" onclick="refreshHome()"><i class="fas fa-sync"></i>Refresh</a><a class="chip tooltipped" data-tooltip="More info" href="/#agency=' + g.agency.id + '"><img src="' + g.agency.icon + '?size=32" onerror=this.onerror=null;this.src="' + g.agency.countryFlag + '">' + g.agency.name + '</a><a class="chip tooltipped" data-tooltip="More info" href="/#pad=' + (g.location.pads && g.location.pads[0].id) + '"><i class="far fa-compass"></i>' + g.location.pads[0].name + '</a><a class="chip tooltipped" id="launchdate" data-tooltip="' + g.net + '"><i class="far fa-clock"></i>' + ReadableDateString(g.net) + '</a></div><p class="flow-text">' + g.description + '</p></div><div id="card-action" class="card-action"><a class="waves-effect waves-light btn hoverable" href="/#id=' + g.id + '">Details</a></div></div>';

        if (g.vidURLs[0] && g.vidURLs[0].match("youtube.com") && !g.vidURLs[0].match("/live")) {
          document.querySelector("#video").innerHTML = '<div class="video-container" id="videoframe1"><iframe name="videoframe1" src="' + g.vidURLs[0].replace("watch?v=", "embed/") + '"  allow="autoplay; fullscreen"></iframe></div><div class="cardnav"><a id="videoframe1_reload" href="' + g.vidURLs[0].replace("watch?v=", "embed/") + '?autoplay=1" target="videoframe1"><i class="fas fa-sync-alt"></i></a><a id="videoframe1_share" href="' + g.vidURLs[0] + '" target="_blank"><i class="fas fa-external-link-square-alt"></i></a></div></div>';
        }

        if (total == (f.count - 1)) break
        //$main.innerHTML = '<ul class="tabs"><li class="tab"><a href="#future" target="_self" class="active">More Launches</a></li></ul>' + $main.innerHTML;
        $upcoming.innerHTML = '<div class="col s12 l' + Math.floor(12 / (f.count - 1)) + '"><div class="card"><div class="card-content"><h5 class="header black-text truncate"><a style="color:black" class="tooltipped" data-tooltip="More Info" href="/#rocket=' + g.rocket.name.split("/")[0] + '">' + g.name.replace(" | ", "</a></h5><h4 class='header black-text truncate'>").split(" (")[0] + '</h4><a class="chip tooltipped" data-tooltip="' + g.agency.name + '" href="/#agency=' + g.agency.id + '"><img src="' + g.agency.icon + '?size=32" onerror=this.src="' + g.agency.countryFlag + '">' + g.agency.shortname + '</a><a class="chip tooltipped" data-tooltip="' + g.location.name + '" href="/#pad=' + g.location.pads[0].id + '"><i class="far fa-compass"></i>' + g.location.name.split(",")[0] + '</a></br><a class="chip tooltipped" data-tooltip="' + g.net + '"><i class="far fa-clock"></i>' + ReadableDateString(g.net) + '</a><h5 id="countdown' + g.id + '">' + g.status + '</h5></div><div class="card-action"><a class="waves-effect waves-light btn hoverable" href="/#id=' + g.id + '">Details</button></div></div></div>' + $upcoming.innerHTML;

        total++


      }
    } else {
      $info.innerHTML = '<h1 class="white-text">No Upcoming Launches</h1>'
    }
  });

  load("launch?limit=4&sort=desc&mode=summary&status=3,4,7", function (f) {
    $successful.innerHTML = '<ul class="tabs"><li class="tab"><a href="#history" target="_self" class="active">Recent Launches</a></li></ul>';
    for (var i in f.launches) {
      var g = f.launches[i];
      days = Math.floor((new Date() - new Date(g.net)) / 86400000);
      $successful.innerHTML += '<div class="col s12 m6 l3"><div class="card"><div class="card-content"><h5 class="header black-text truncate"><a style="color:black" class="tooltipped" data-tooltip="More info" href="/#rocket=' + g.name.split(" |")[0].split("/")[0] + '">' + g.name.replace(" | ", "</a></h5><h4 class='header black-text truncate'>").split(" (")[0] + '</h4><a class="chip tooltipped" data-tooltip="' + g.net + '"><i class="far fa-clock"></i>' + ReadableDateString(g.net) + '</a></br><a class="chip">' + ((days > 0) ? days + " Days ago" : "Today") + "</a><h5>" + g.status + '</h5></div><div class="card-action"><a class="waves-effect waves-light btn hoverable" href="/#id=' + g.id + '">Watch</a></div></div>';
    }

    for (i = 1; i <= ($successful.childElementCount - 1); i++) {
      $successful.children[i].className = 'col s12 l' + Math.floor(12 / ($successful.childElementCount - 1))
    }
  });

  getJSON(location.origin + "/data/sources.json", function (e) {
    if (e.featuring) {
      $featured.innerHTML = '<ul class="tabs"><li class="tab"><a class="active">Featured</a></li></ul>';
      for (var a in e.featuring) {
        $featured.innerHTML += '<div class="col s12 m6 l4"><div class="card"><div class="card-content"><img class="circle logo" src="' + e.featuring[a].img + '" onerror=this.onerror=null;this.src=""><h5 class="header black-text truncate">' + e.featuring[a].name + "</h5><a class='max2lines'>" + e.featuring[a].desc + '</a></div><div class="card-action"><a class="waves-effect waves-light btn hoverable" href="' + e.featuring[a].url + '">' + e.featuring[a].action + "</a></div></div>"
      }
    }
  }, true);
  materialize()
}

function search(c) {
  if (c != "undefined") {

    getJSON(location.origin + "/data/sources.json", function (a) {
      for (var i in a.info.search) {
        if (c.toLowerCase().match(i) && !document.getElementById("maintabs")) {
          data = a.info.search[i]
          $info.innerHTML = '<div class="card-content"><img class="circle" src="' + data.img + '" onerror=this.onerror=null;this.src=""><h1 class="header black-text truncate">' + data.name + '</h1><div id="chips"><a class="chip" href="javascript:window.history.back();"><i class="fas fa-arrow-alt-circle-left"></i>Go Back</a></div></br><a class="flow-text">' + (data.desc || "") + '</a></div><div class="card-tabs"><ul id="maintabs" class="tabs tabs-fixed-width"></ul></div>';
          for (var b in data.badges) {
            badge = data.badges[b];
            document.getElementById("chips").innerHTML += '<a class="chip tooltipped" data-tooltip="' + (badge.tip || "") + '" href="' + (badge.url || "") + '"><img src="' + (badge.img || "") + '">' + (badge.name || "") + "</a>"
          }
          break
        }
      }

      if (!document.getElementById("maintabs"))
        $info.innerHTML = '<div class="card-content"><h1 class="header black-text truncate">Results for "' + c + '"</h1><div id="chips"><a class="chip" href="javascript:window.history.back();"><i class="fas fa-arrow-alt-circle-left"></i>Go Back</a></div></div><div class="card-tabs"><ul id="maintabs" class="tabs tabs-fixed-width"></ul></div>'


      load("launch?limit=200&mode=summary&sort=desc&name=" + c + "&format=stats" + (($query.type == "failures") ? "&status=4" : ""), function (a) {
        if (loading = document.getElementById("loading")) {
          loading.parentNode.removeChild(loading)
        }

        if (a.launches.length) {
          $main.innerHTML += '<div id="results"><div id="next"></div><div id="switch" style="display:none" class="card-tabs"><ul class="tabs"><li class="tab"><a href="#past">Launched</a></li><li class="tab"><a href="#future">Upcoming</a></li></ul></div><div id="past"></div><div id="future"></div></div>';
          $future = document.getElementById("future");
          $past = document.getElementById("past");
          $today = new Date();

          if (a.launches.length == 1) {
            document.getElementById("maintabs").innerHTML = '<li class="tab"><a href="#results" class="active">Launches</a></li>' + document.getElementById("maintabs").innerHTML;
            var b = a.launches[0];
            document.getElementById("next").innerHTML = '<div class="col s12"><div class="card"><div class="card-stacked"><div class="card-content"><h3 class="header black-text"><a style="color:black" class="tooltipped" data-tooltip="More info" href="/#rocket=' + b.name.split(" | ")[0].split("/")[0] + '">' + b.name.replace(" | ", "</a></h3><h2>") + '</h2><a class="chip tooltipped" data-tooltip="' + b.net + '"><i class="far fa-clock"></i>' + ReadableDateString(b.net) + '</a><h4 id="countdown' + b.id + '">' + b.status + '</h4></div><div class="card-action"><a class="waves-effect waves-light btn hoverable" href="/#id=' + b.id + '">Details</a></div></div></div>';
          } else {
            document.getElementById("maintabs").innerHTML = '<li class="tab"><a href="#stats">Stats</a></li>' + document.getElementById("maintabs").innerHTML;
            document.getElementById("maintabs").innerHTML = '<li class="tab"><a href="#results" class="active">Launches</a></li>' + document.getElementById("maintabs").innerHTML;

            for (var g in a.launches) {
              var b = a.launches[g];
              if (Date.parse(b.net) < $today) {
                $past.innerHTML += '<div class="col s12 m6"><div class="card"><div class="card-content"><h5 class="header black-text truncate"><a style="color:black" class="tooltipped" data-tooltip="More info" href="/#rocket=' + b.name.split(" | ")[0].split("/")[0] + '">' + b.name.replace(" | ", "</a></h5><h4 class='header black-text truncate'>") + '</h4><a class="chip tooltipped" data-tooltip="' + b.net + '"><i class="far fa-clock"></i>' + ReadableDateString(b.net) + "</a><h5>" + b.status + '</h5></div><div class="card-action"><a class="waves-effect waves-light btn hoverable" href="/#id=' + b.id + '">Watch</a></div></div>'
              } else {
                if (Date.parse(b.net) > $today) {
                  $future.innerHTML = '<div class="col s12 m6"><div class="card"><div class="card-content"><h5 class="header black-text truncate"><a style="color:black" class="tooltipped" data-tooltip="More info" href="/#rocket=' + b.name.split(" | ")[0].split("/")[0] + '">' + b.name.replace(" | ", "</a></h5><h4 class='header black-text truncate'>") + '</h4><a class="chip tooltipped" data-tooltip="' + b.net + '"><i class="far fa-clock"></i>' + ReadableDateString(b.net) + "</a><h5>" + b.status + '</h5></div><div class="card-action"><a class="waves-effect waves-light btn hoverable" href="/#id=' + b.id + '">Details</a></div></div></div>' + $future.innerHTML;
                }
                if (b.statuscode == 1 || b.statuscode == 5 || b.statuscode == 6) {
                  document.getElementById("next").innerHTML = '<div class="col s12"><div class="card"><div class="card-stacked"><div class="card-content"><h3 class="header black-text"><a style="color:black" class="tooltipped" data-tooltip="More info" href="/#rocket=' + b.name.split(" | ")[0].split("/")[0] + '">' + b.name.replace(" | ", "</a></h3><h2>") + '</h2><a class="chip tooltipped" data-tooltip="' + b.net + '"><i class="far fa-clock"></i>' + ReadableDateString(b.net) + '</a><h4 id="countdown' + b.id + '">' + b.status + '</h4></div><div class="card-action"><a class="waves-effect waves-light btn hoverable" href="/#id=' + b.id + '">Details</a></div></div></div>';
                  if (b.statuscode == 1 || b.statuscode == 6)
                    new Countdown(b.net, "countdown" + b.id);
                }
              }
              if ($future.innerHTML && $past.innerHTML) {
                document.getElementById("switch").style.display = "unset";
              }
            }

            var labels = [];
            var togo = [];
            var success = [];
            var fail = [];
            for (var k in a.stats.byYear) {
              if (k <= new Date().getUTCFullYear()) {
                labels.push(parseInt(k));
                togo.push(a.stats.byYear[k][1] + a.stats.byYear[k][2]);
                success.push(a.stats.byYear[k][3]);
                fail.push(a.stats.byYear[k][4]);
              }
            }

            var rocketlist = "";
            for (var i in a.rockets) {
              rocketlist += '<li class="collection-item"><a href="/#rocket=' + a.rockets[i] + '">' + a.rockets[i] + '</a></li>'
            }

            $stats = document.createElement("div");
            $stats.id = "stats";
            $main.appendChild($stats);
            $stats.innerHTML += '<div class="col s12"><div class="card"><div class="video-container"><canvas id="launchesPerYear"></canvas></div></div></div>';
            $stats.innerHTML += '<div class="col s12 m6"><div class="card-panel"><div class="video-container"><canvas id="successRate"></canvas></div><p class="flow-text">' + Math.abs(Math.round((1 - ((a.stats.byStatus[4] && a.stats.byStatus[4].length) || 0) / (a.stats.byStatus[3] && a.stats.byStatus[3].length || 0)) * 100)).toString().replace("-Infinity", "0") + '% </p></div></div>';
            $stats.innerHTML += '<div class="col s12 m6"><div class="card-panel"><div class="video-container"><h1>' + (((a.stats.byStatus[1] && a.stats.byStatus[1].length) || 0) + ((a.stats.byStatus[2] && a.stats.byStatus[2].length) || 0)) + '</h1></div><p class="flow-text">Confirmed launch backlog</p></div></div>';
            //$stats.innerHTML += '<div class="col s12"><div class="card-panel"><h1>' + a.rockets.length + ' Rockets:</h1><ul class="collection">' + rocketlist + '</ul></div></div>';




            new Chart(document.getElementById("launchesPerYear").getContext("2d"), {
              type: "bar",
              data: {
                labels: labels,
                datasets: [{
                  label: 'Failures',
                  backgroundColor: "rgb(255, 99, 132)",
                  data: fail
                }, {
                  label: 'Successes',
                  backgroundColor: "rgb(75, 192, 192)",
                  data: success
                }, {
                  label: 'Planned',
                  backgroundColor: "rgb(201, 203, 207)",
                  data: togo
                }]
              },
              options: {
                tooltips: {
                  mode: 'label',
                  callbacks: {
                    afterTitle: function () {
                      window.launchTotal = 0;
                    },
                    label: function (tooltipItem, data) {
                      var dataset = data.datasets[tooltipItem.datasetIndex];
                      var count = parseFloat(dataset.data[tooltipItem.index]);
                      window.launchTotal += count;

                      if (count === 0) {
                        return '';
                      }
                      return dataset.label + ': ' + count.toLocaleString();

                    },
                    footer: function () {
                      return 'TOTAL: ' + window.launchTotal.toLocaleString()
                    }
                  }
                },

                title: {
                  display: true,
                  text: "Launches per Year"
                },
                scales: {
                  xAxes: [{
                    stacked: true
                  }],
                  yAxes: [{
                    stacked: true,
                    ticks: {
                      stepSize: 5
                    }
                  }]
                }
              }
            });

            new Chart(document.getElementById("successRate").getContext("2d"), {
              type: "doughnut",
              data: {
                labels: ['Failures', 'Successes'],
                datasets: [{
                  data: [((a.stats.byStatus[4] && a.stats.byStatus[4].length) || 0), ((a.stats.byStatus[3] && a.stats.byStatus[3].length) || 0)],
                  backgroundColor: ["rgb(255, 99, 132)", "rgb(75, 192, 192)"]
                }]
              },
              options: {
                title: {
                  display: true,
                  text: "Success Rate"
                },
                legend: {
                  display: false
                }
              }
            });
          }

          if (a.stats.byStatus[3])
            document.getElementById("chips").innerHTML += '<a class="chip">' + a.stats.byStatus[3].length + ' successful launches</a>';
          if (a.stats.byStatus[4] && $query.type != "failures") {
            document.getElementById("chips").innerHTML += '<a class="chip tooltipped" data-tooltip="Filter failures only" href="/' + (location.search || location.hash) + '&type=failures">' + a.stats.byStatus[4].length + ' failures</a>'
          } else if ($query.type == "failures") {
            document.getElementById("chips").innerHTML += '<a class="chip">' + a.stats.byStatus[4].length + ' failures (Failures Only)</a>'
          }

        } else {
          if (document.getElementById("chips")) {
            document.getElementById("chips").innerHTML += '<a class="chip">No launches</a>';
          }
          if (!document.getElementById("news") && !document.getElementById("information")) {
            $main.innerHTML = '<h1 class="white-text">' + (a.msg || a.code).replace("None found", "No Launches") + '</h1></br>';
          }
        }
        materialize()
      })
    });

  } else {
    enter = function (event) {
      if (event.which == 13 || event.keyCode == 13) {
        location.hash = 'search=' + document.getElementsByTagName('input')[0].value;
        return false;
      }
      return true;
    }
    $info.innerHTML = '<div class="card-content"><h1 class="header black-text truncate">What are you looking for?</h1></div>';
    $main.innerHTML = '<div class="row"><div class="col s12"><div class="card"><div class="card-content"><div class="input-field"><input onkeypress="return enter(event)" type="text" name="search"></div></div><div class="card-action"><a onclick="(location.hash = \'search=\' + document.getElementsByTagName(\'input\')[0].value)" class="waves-effect waves-light btn hoverable">Submit</a></div></div></div>';
  }
}

function agency(m) {
  if (m != "undefined") {
    load("agency/" + m + "?mode=verbose&format=news", function (g) {
      if (g.agencies.length) {
        var c = g.agencies[0];

        document.getElementById("richEmbed").innerHTML = '{ "@context": "https://schema.org", "@type": "Organization", "name": "' + c.name + '", "url": "' + (c.infoURL || c.info) + '", "logo": "' + (c.icon || c.img) + '" }';

        $info.innerHTML = '<div class="card-content"><img class="circle logo materialboxed" src="' + c.icon + '" onerror=this.onerror=null;this.style.display="none";><h1 class="tooltipped" data-tooltip="' + c.shortname + '">' + c.name.split(" (")[0] + '</h1><div id="chips"><a class="chip" href="javascript:window.history.back();"><i class="fas fa-arrow-alt-circle-left"></i>Go Back</a><a class="chip tooltipped" data-tooltip="Country summary" href="/#country=' + c.countryCode + '"><img src="' + c.countryFlag + '">' + c.countryCode + '</a><a class="chip">Founded: ' + c.founded + '</a></div><p class="flow-text">' + c.description + '</p></div><div class="card-tabs"><ul id="maintabs" class="tabs tabs-fixed-width"></ul></div></div>';

        for (var i in c.social) {
          if ($query.type == "failures") $list.style.display = "none";

          $main.innerHTML += '<div id="news"><div class="col s12"><div class="card"><div class="card-stacked"><div class="card-content"><h3 class="header black-text">Get notified about agency news and updates:</h3></div><div class="card-action"><a class="waves-effect waves-light btn hoverable" onclick=\"saveValue(\'notifications_agency_' + c.id + '\', ' + !($settings["notifications_agency_" + c.id]) + ');this.innerHTML = \'Saved\'\">' + (($settings["notifications_agency_" + c.id]) ? "Unsubscribe" : "Subscribe") + '</a></div></div></div><div class="card-tabs"><ul id="tabs" class="tabs tabs-fixed-width"></ul></div></div>';
          document.getElementById("maintabs").innerHTML += '<li class="tab"><a href="#news">News</a></li>';

          $list = document.getElementById("news");

          //<div class="col s12"><div class="card"><div class="card-content"><h5><a>Subscribe to news & updates notifications</a></h5></div><div class="card-action"><a class="waves-effect waves-light btn hoverable" onclick="subscribe()">Subscribe</a></div></div>
          if (c.news.reddit) {
            document.getElementById("tabs").innerHTML += '<li class="tab"><a class="active" href="#reddit">Reddit</a></li>';
            var a = document.createElement("div");
            a.id = "reddit";
            for (var b in c.news.reddit) {
              var h = c.news.reddit[b];
              a.innerHTML += '<div class="col s12"><div class="card"><div class="card-content"><img class="materialboxed circle" onerror=this.onerror=null;this.style.display="none" src="' + h.img + '" /><h5>' + h.title + '</h5><p class="flow-text">' + h.content + '</p></div><div class="card-action"><a class="waves-effect waves-light btn hoverable" href="' + h.url + '" target="_blank">Read more</a></div></div></div></div>'
            }
            $list.appendChild(a)
          }

          if (c.news.facebook) {
            document.getElementById("tabs").innerHTML += '<li class="tab"><a href="#facebook">Facebook</a></li>';
            var j = document.createElement("div");
            j.id = "facebook";
            for (var b in c.news.facebook) {
              var h = c.news.facebook[b];
              j.innerHTML += '<div class="col s12"><div class="card"><div class="card-content"><img class="materialboxed circle" onerror=this.onerror=null;this.style.display="none" src="' + h.img + '" /><h5>' + h.title + '</h5><p class="flow-text">' + h.content + '</p></div><div class="card-action"><a class="waves-effect waves-light btn hoverable" href="' + h.url + '" target="_blank">Read more</a></div></div></div></div>'
            }
            $list.appendChild(j)
          }

          if (c.news.youtube) {
            document.getElementById("tabs").innerHTML += '<li class="tab"><a href="#youtube">YouTube</a></li>';
            var s = document.createElement("div");
            s.id = "youtube";
            for (var b in c.news.youtube) {
              var h = c.news.youtube[b];
              s.innerHTML += '<div class="col s12"><div class="card"><div class="video-container"><iframe src="' + h.url + '"></iframe></div><div class="card-content"><p class="flow-text">' + h.content + "</p></div></div></div>"
            }
            $list.appendChild(s)
          }

          if (c.news.twitter) {
            document.getElementById("tabs").innerHTML += '<li class="tab"><a href="#twitter">Twitter</a></li>';
            var u = document.createElement("div");
            u.id = "twitter";
            u.innerHTML += '<div class="col s12"><div class="card"><div class="video-container"><a class="twitter-timeline" data-dnt="true" href="https://twitter.com/' + c.social.twitter + '" ' + ($settings.dark ? " data-theme=\"dark\"" : "") + '></a></div></div></div>';
            $list.appendChild(u);
            if (twttr) {
              twttr.widgets.load();
            }
          }
          break
        }

        if (c.wiki.length) {
          document.getElementById("maintabs").innerHTML += '<li class="tab"><a href="#information">Info</a></li>';

          $main.innerHTML += '<div id="information"><div class="card"><div class="video-container"><iframe  src="' + c.wiki.replace("http://", "https://") + '"></iframe></div></div></div>'
        }

        search((c.islsp ? "&lsp=" : "&agency=") + c.id);
      } else {
        $main.innerHTML = '<h1 class="white-text" ="location.reload(true)">' + g.msg || g.status || "Error</h1>"
      }
    });
  } else {
    var p = parseInt($query.page) || 1;
    var l = 30;
    var j = l * (p - 1);
    load("agency?limit=" + l + "&islsp=1&offset=" + j, function (c) {
      if (c.agencies.length) {
        $main.innerHTML = '';
        $info.innerHTML = '<div class="card-content"><h1>Agencies</h1><div id="chips"><div style="display:' + ((p == 1) ? 'none' : 'unset') + '" ><a class="chip" href="/#agency&page=' + (p - 1) + '"><i id="pagination" class="fas fa-chevron-left"></i></a></div><a class="chip">Page ' + p + '</a><div style="display:' + ((p == Math.ceil(c.total / l)) ? 'none' : 'unset') + '"><a  class="chip" href="/#agency&page=' + (p + 1) + '"><i id="pagination" class="fas fa-chevron-right"></i></a></div></div></div>';
        for (var b in c.agencies) {
          var a = c.agencies[b];
          $main.innerHTML += '<div class="col s12 m6"><div class="card"><div class="card-content"><h5 class="header black-text truncate">' + a.name + '</h5><a class="chip"><img src="' + a.icon + '" onerror=this.onerror=null;this.src="' + a.countryFlag + '">' + a.abbrev + '</a><a class="chip">' + a.type + ' Agency</a></div><div class="card-action"><a class="waves-effect waves-light btn hoverable" href="/#agency=' + a.id + '">Details</a></div></div>'
        }
        $main.innerHTML += '<div class="col s12"><div class="card"><ul class="pagination"><li class="' + ((p == 1) ? 'disabled" style="pointer-events:none;"' : "waves-effect") + '" ><a href="/#agency&page=' + (p - 1) + '"><i id="pagination" class="fas fa-chevron-left"></i></a></li> Page ' + p + "/" + Math.ceil(c.total / l) + ' <li class="' + ((p == Math.ceil(c.total / l)) ? 'disabled" style="pointer-events:none;"' : "waves-effect") + '"><a href="/#agency&page=' + (p + 1) + '"><i id="pagination" class="fas fa-chevron-right"></i></a></li></ul></div></div>'
      } else {
        $main.innerHTML = '<h1 class="white-text" onclick="location.reload(true)">' + c.msg || c.status || "Error</h1>"
      }

      // preload NEXT
      load("agency?limit=" + l + "&mode=verbose&islsp=1&offset=" + (l * p));
    });
  }
}

function nation(k) {
  load("agency?islsp=1&countryCode=" + k, function (a) {
    if (a.agencies.length) {
      var c = a.agencies[0];
      $info.innerHTML = '<div class="card-content"><img class="circle materialboxed" src="' + c.countryFlag + '" onerror=this.onerror=null;this.style.display="none"><h1>' + k + '</h1><a class="chip" href="javascript:window.history.back();"><i class="fas fa-arrow-alt-circle-left"></i>Go Back</a></div><div class="card-tabs"><ul id="maintabs" class="tabs tabs-fixed-width"><li class="tab"><a href="#agencies">Agencies</a></li></ul></div></div>';
      $main.innerHTML = '';
      $agencies = document.createElement("div");
      $agencies.id = "agencies";
      $main.appendChild($agencies);
      for (var c in a.agencies) {
        c = a.agencies[c];
        $agencies.innerHTML += '<div class="col s12 m6"><div class="card"><div class="card-content"><h5 class="header black-text truncate">' + c.name + '</h5><a class="chip"><img src="' + c.icon + '" onerror=this.onerror=null;this.style.display="none">' + c.abbrev + '</a><a class="chip">' + c.type + ' Agency</a></div><div class="card-action"><a class="waves-effect waves-light btn hoverable" href="/#agency=' + c.id + '">Details</a></div>'
      }
    } else {
      $main.innerHTML = '<h1 class="white-text" onclick="location.reload(true)">Not found</h1>'
    }
  });
  load("location?countrycode=" + k, function (c) {
    if (c.locations.length) {
      document.getElementById("maintabs").innerHTML += '<li class="tab"><a href="#locations">Launch Locations</a></li>';
      $locations = document.createElement("div");
      $locations.id = "locations";
      $main.appendChild($locations);
      for (var b in c.locations) {
        var a = c.locations[b];
        $locations.innerHTML += '<div class="col s12 m6"><div class="card"><div class="card-content"><h5 class="header black-text truncate">' + a.name + '</h5><a class="chip"><img src="' + a.countryFlag + '">' + a.countryCode + '</a></div><div class="card-action"><a class="waves-effect waves-light btn hoverable" href="/#location=' + a.id + '">Details</a></div></div>'
      }
    }
  });
  materialize()
}

function pad(m) {
  var k = document.createElement("div");
  $main.appendChild(k);
  var l = document.createElement("div");
  l.id = "information";
  l.className = "col s12"
  l.style.display = "none"
  $main.appendChild(l);

  if (m != "undefined") {
    load("pad/" + m + "?mode=verbose", function (g) {
      if (g.pads.length) {
        var c = g.pads[0];

        document.getElementById("richEmbed").innerHTML = '{ "@context": "https://schema.org", "@type": "Organization", "name": "' + c.name + '", "url": "' + (c.infoURL || c.info) + '", "logo": "' + (c.icon || c.img) + '" }';

        $info.innerHTML = '<div class="card-content"><img class="circle materialboxed" src="' + c.img + '" onerror=this.onerror=null;this.style.display="none"><h1>' + c.name + '</h1><div id="chips"><a class="chip" href="javascript:window.history.back();"><i class="fas fa-arrow-alt-circle-left"></i>Go Back</a><a class="chip tooltipped"data-tooltip="Country summary" href="/#country=' + (c.agency && c.agency.countryCode) + '"><img src="' + (c.agency && c.agency.countryFlag) + '">' + (c.agency && c.agency.countryCode) + '</a><a class="chip tooltipped" data-tooltip="More info" href="/#agency=' + (c.agency && c.agency.id) + '"><img src="' + c.agency.icon + '?size=32" onerror=this.onerror=null;this.style.display="none">' + (c.agency && c.agency.name) + '</a></div></div><div class="card-tabs"><ul id="maintabs" class="tabs tabs-fixed-width"></ul></div>';

        document.getElementById("maintabs").innerHTML = '<li class="tab"><a href="#information">Info</a></li>' + document.getElementById("maintabs").innerHTML;
        l.innerHTML = '<div class="card"><div class="video-container"><iframe src="' + c.map + '"></iframe></div></div>';
        if (c.info) {
          l.innerHTML += '<div class="card"><div class="video-container"><iframe  src="' + c.info + '"></iframe></div></div>';
        }
        search("&locationid=" + c.id);
      } else {
        r.innerHTML = '<h1 class="white-text" onclick="location.reload(true)">' + g.msg || g.status || "Error</h1>"
      }
    });
  } else {
    var p = parseInt($query.page) || 1;
    var l = 28;
    var e = l * (p - 1);
    load("pad?limit=" + l + "&mode=verbose&retired=0&offset=" + e, function (c) {
      if (c.pads.length) {
        $info.innerHTML = '<div class="card-content"><h1>Launch pads</h1><div id="chips"><div style="display:' + ((p == 1) ? 'none' : 'unset') + '" ><a class="chip" href="/#pad&page=' + (p - 1) + '"><i id="pagination" class="fas fa-chevron-left"></i></a></div><a class="chip">Page ' + p + '</a><div style="display:' + ((p == Math.ceil(c.total / l)) ? 'none' : 'unset') + '"><a  class="chip" href="/#pad&page=' + (p + 1) + '"><i id="pagination" class="fas fa-chevron-right"></i></a></div></div></div>';
        $main.innerHTML = ''
        for (var b in c.pads) {
          var a = c.pads[b];
          $main.innerHTML += '<div class="col s12 m6 l3"><div class="card"><div class="card-image"><img src="' + a.img + '"><span class="card-title">' + a.name + '</span></div><div class="card-content"><a class="chip" href="/#agency=' + a.agency.id + '">' + a.agency.abbrev + '</a><a class="chip">' + a.agency.type + ' Pad</a></div><div class="card-action"><a class="waves-effect waves-light btn hoverable" class="tooltipped" data-tooltip="More info" href="/#pad=' + a.id + '">Details</a></div>'
        }
        $main.innerHTML += '<div class="col s12"><div class="card"><ul class="pagination"><li class="' + ((p == 1) ? 'disabled" style="pointer-events:none;"' : "waves-effect") + '" ><a href="#pad&page=' + (p - 1) + '"><i id="pagination" class="fas fa-chevron-left"></i></a></li> Page ' + p + "/" + Math.ceil(c.total / l) + ' <li class="' + ((p == Math.ceil(c.total / l)) ? 'disabled" style="pointer-events:none;"' : "waves-effect") + '"><a href="#pad&page=' + (p + 1) + '"><i id="pagination" class="fas fa-chevron-right"></i></a></li></ul></div></div>'
      } else {
        $main.innerHTML = '<h1 class="white-text" onclick="location.reload(true)">' + c.msg || c.status || "Error</h1>"
      }

      // preload next
      load("pad?limit=" + l + "&mode=verbose&retired=0&offset=" + (l * p));
    });
  }
}

function launchcentre(m) {
  var k = document.createElement("div");
  $main.appendChild(k);
  var l = document.createElement("div");
  l.id = "information";
  l.className = "col s12"
  l.style.display = "none"
  $main.appendChild(l);

  if (m != "undefined") {
    load("location/" + m + "?mode=verbose", function (g) {
      if (g.locations.length) {
        var c = g.locations[0];

        document.getElementById("richEmbed").innerHTML = '{ "@context": "https://schema.org", "@type": "Organization", "name": "' + c.name + '", "url": "' + (c.infoURL || c.info) + '", "logo": "' + (c.icon || c.img) + '" }';

        $info.innerHTML = '<div class="card-content"><img class="circle materialboxed" src="' + c.img + '" onerror=this.onerror=null;this.style.display="none"><h1>' + c.name.split(", ")[0] + '</h1><div id="chips"><a class="chip" href="javascript:window.history.back();"><i class="fas fa-arrow-alt-circle-left"></i>Go Back</a><a class="chip tooltipped" data-tooltipped="Country summary" href="/#country=' + c.countryCode + '"><img src="' + c.countryFlag + '">' + c.name.split(", ")[1] + ", " + c.countryCode + '</a></div></div><div class="card-tabs"><ul id="maintabs" class="tabs tabs-fixed-width"></ul></div>';

        document.getElementById("maintabs").innerHTML = '<li class="tab"><a href="#information">Info</a></li>' + document.getElementById("maintabs").innerHTML;
        l.innerHTML = '<div class="card"><div class="video-container"><iframe src="' + c.map + '""></iframe></div></div>';
        if (c.info) {
          l.innerHTML += '<div class="card"><div class="video-container"><iframe  src="' + c.info + '"></iframe></div></div>';
        }
        search("&padLocation=" + c.id);
      } else {
        r.innerHTML = '<h1 class="white-text" onclick="location.reload(true)">' + g.msg || g.status || "Error</h1>"
      }
    });
  } else {
    var p = parseInt($query.page) || 1;
    var l = 30;
    var e = l * (p - 1);
    load("location?limit=" + l + "&mode=verbose&retired=0&offset=" + e, function (c) {
      if (c.locations.length) {
        $info.innerHTML = '<div class="card-content"><h1>Launch Centers</h1><div id="chips"><div style="display:' + ((p == 1) ? 'none' : 'unset') + '" ><a class="chip" href="/#location&page=' + (p - 1) + '"><i id="pagination" class="fas fa-chevron-left"></i></a></div><a class="chip">Page ' + p + '</a><div style="display:' + ((p == Math.ceil(c.total / l)) ? 'none' : 'unset') + '"><a  class="chip" href="/#location&page=' + (p + 1) + '"><i id="pagination" class="fas fa-chevron-right"></i></a></div></div></div>';
        $main.innerHTML = ''
        for (var b in c.locations) {
          var a = c.locations[b];
          $main.innerHTML += '<div class="col s12 m6"><div class="card"><div class="card-content"><h5 class="header black-text truncate">' + a.name + '</h5><a class="chip"><img src="' + a.countryFlag + '">' + a.countryCode + '</a></div><div class="card-action"><a class="waves-effect waves-light btn hoverable" href="/#location=' + a.id + '">Details</a></div></div>'
        }
        $main.innerHTML += '<div class="col s12"><div class="card"><ul class="pagination"><li class="' + ((p == 1) ? 'disabled" style="pointer-events:none;"' : "waves-effect") + '" ><a href="#location&page=' + (p - 1) + '"><i id="pagination" class="fas fa-chevron-left"></i></a></li> Page ' + p + "/" + Math.ceil(c.total / l) + ' <li class="' + ((p == Math.ceil(c.total / l)) ? 'disabled" style="pointer-events:none;"' : "waves-effect") + '"><a href="#location&page=' + (p + 1) + '"><i id="pagination" class="fas fa-chevron-right"></i></a></li></ul></div></div>'
      } else {
        $main.innerHTML = '<h1 class="white-text" onclick="location.reload(true)">' + c.msg || c.status || "Error</h1>"
      }

      // preload next
      load("location?limit=" + l + "&mode=verbose&retired=0&offset=" + (l * p));
    });
  }
}

function rocket(m) {
  if (m != "undefined") {
    load("rocket/" + m + "?mode=verbose", function (c) {
      if (c.rockets.length) {
        var a = c.rockets[0];
        document.getElementById("richEmbed").innerHTML = '{ "@context": "https://schema.org", "@type": "Organization", "name": "' + a.name + '", "url": "' + (a.info || a.infoURL) + '", "logo": "' + (a.icon || a.img) + '" }';

        $info.innerHTML = '<div class="card-content"><img class="circle materialboxed" src="' + a.img + '" onerror=this.onerror=null;this.style.display="none"><h1>' + a.name + '</h1><div id="chips"><a class="chip" href="javascript:window.history.back();"><i class="fas fa-arrow-alt-circle-left"></i>Go Back</a><a class="chip tooltipped" data-tooltip="More info" href="/#country=' + a.agency.countryCode + '"><img src="' + a.agency.countryFlag + '">' + a.agency.countryCode + '</a><a class="chip tooltipped" data-tooltip="More info" href="/#agency=' + a.agency.id + '"><img src="' + a.agency.icon + '">' + a.agency.shortname + '</a></div><p class="flow-text">' + a.description + '</p></div><div class="card-tabs"><ul id="maintabs" class="tabs tabs-fixed-width"></ul></div>';

        if (a.wiki.length) {
          $main.innerHTML += '<div id="information"><div class="card"><div class="video-container"><iframe  src="' + a.wiki.replace("http://", "https://") + '"></iframe></div></div></div>'
          document.getElementById("maintabs").innerHTML = '<li class="tab"><a href="#information">Info</a></li>' + document.getElementById("maintabs").innerHTML;
        }

        search("&rocketid=" + a.id);
      } else {
        $main.innerHTML = '<h1 class="white-text" onclick="location.reload(true)">' + c.msg || c.status || "Error</h1>"
      }
    });
  } else {
    var k = parseInt($query.page) || 1;
    var l = 27;
    var j = l * (k - 1);
    load("rocket?mode=verbose&limit=" + l + "&offset=" + j, function (c) {
      if (c.rockets.length > 0) {
        $info.innerHTML = '<div class="card-content"><h1>Rockets</h1><div id="chips"><div style="display:' + ((k == 1) ? 'none' : 'unset') + '" ><a class="chip" href="/#rocket&page=' + (k - 1) + '"><i id="pagination" class="fas fa-chevron-left"></i></a></div><a class="chip">Page ' + k + '</a><div style="display:' + ((k == Math.ceil(c.total / l)) ? 'none' : 'unset') + '"><a  class="chip" href="/#rocket&page=' + (k + 1) + '"><i id="pagination" class="fas fa-chevron-right"></i></a></div></div></div>';
        $main.innerHTML = '';
        for (var b in c.rockets) {
          var a = c.rockets[b];
          $main.innerHTML += '<div class="col s12 m6 l4"><div class="card"><div class="card-image"><a href="/#rocket=' + a.id + '"><img src="' + (a.img || "https://rocket.watch/res/rocket_placeholder.jpg") + '" ></a><span class="card-title"><a class="chip" href="/#agency=' + a.agency.id + '">' + a.agency.name + '</a><a class="chip" href="/#rocket=' + a.id + '">' + a.name + '</a></span></div></div></div>'
        }
        $main.innerHTML += '<div class="col s12"><div class="card"><ul class="pagination"><li class="' + ((k == 1) ? 'disabled" style="pointer-events:none;"' : "waves-effect") + '" ><a href="/#rocket&page=' + (k - 1) + '"><i id="pagination" class="fas fa-chevron-left"></i></a></li> Page ' + k + "/" + Math.ceil(c.total / l) + ' <li class="' + ((k == Math.ceil(c.total / l)) ? 'disabled" style="pointer-events:none;"' : "waves-effect") + '"><a href="/#rocket&page=' + (k + 1) + '"><i id="pagination" class="fas fa-chevron-right"></i></a></li></ul></div></div>'
      } else {
        $main.innerHTML = '<h1 class="white-text" onclick="location.reload(true)">' + c.msg || c.status || "Error</h1>"
      }

      // preload next
      load("rocket?mode=verbose&limit=" + l + "&offset=" + (l * k));
    });
  }
}

function timeline(k, l) {
  var l = parseInt(l) || 1;
  var m = 20;
  var j = m * (l - 1);
  $main.innerHTML = ""

  load("launch?mode=verbose&limit=" + m + (k ? "&sort=desc&status=3,4,7" : "&status=1,2,5,6") + "&offset=" + j, function (a) {
    for (var c in a.launches) {
      var b = a.launches[c];
      $main.innerHTML += '<div class="col s12 m6"><div class="card"><div class="card-content"><h5 class="header black-text truncate"><a style="color:black" class="tooltipped" data-tooltip="More info" href="/#rocket=' + b.name.split(" |")[0].split("/")[0] + '">' + b.name.replace(" | ", "</a></h5><h4 class='header black-text truncate'>") + '</h4><a class="chip tooltipped" data-tooltip="' + b.agency.name + '" href="/#agency=' + b.agency.id + '"><img src="' + b.agency.icon + '?size=32" onerror=this.src="' + b.agency.countryFlag + '">' + b.agency.shortname + '</a><a class="chip tooltipped" data-tooltip="' + b.location.name + '" href="/#pad=' + b.location.pads[0].id + '"><i class="far fa-compass"></i>' + b.location.name.split(",")[0] + '</a></br><a class="chip tooltipped" data-tooltip="' + b.net + '"><i class="far fa-clock"></i>' + ReadableDateString(b.net) + '</a><h5 id="countdown' + b.id + '">' + b.status + '</h5></div><div class="card-action"><a class="waves-effect waves-light btn hoverable" href="/#id=' + b.id + '">More</a></div></div>';
      if (b.statuscode == 1 || b.statuscode == 6) {
        new Countdown(b.net, "countdown" + b.id)
      }
    }
    if (k) {
      $info.innerHTML = '<div class="card-content"><h1>Historical launches</h1><div id="chips"><div style="display:' + ((l == 1) ? 'none' : 'unset') + '" ><a class="chip" href="/#history=' + (l - 1) + '"><i id="pagination" class="fas fa-chevron-left"></i></a></div><a class="chip">Page ' + l + '</a><div style="display:' + ((l == Math.ceil(a.total / m)) ? 'none' : 'unset') + '"><a  class="chip" href="/#history=' + (l + 1) + '"><i id="pagination" class="fas fa-chevron-right"></i></a></div></div></div>';
      $main.innerHTML += '<div class="col s12"><div class="card"><div style="display:' + ((l == 1) ? 'none' : 'unset') + '" ><a class="chip" href="/#history=' + (l - 1) + '"><i id="pagination" class="fas fa-chevron-left"></i></a></div><a class="chip">Page ' + l + '</a><div style="display:' + ((l == Math.ceil(a.total / m)) ? 'none' : 'unset') + '"><a  class="chip" href="/#history=' + (l + 1) + '"><i id="pagination" class="fas fa-chevron-right"></i></a></div></div></div>'

    } else {
      $info.innerHTML = '<div class="card-content"><h1>Planned launches</h1><div id="chips"><div style="display:' + ((l == 1) ? 'none' : 'unset') + '" ><a class="chip" href="/#future=' + (l - 1) + '"><i id="pagination" class="fas fa-chevron-left"></i></a></div><a class="chip">Page ' + l + '</a><div style="display:' + ((l == Math.ceil(a.total / m)) ? 'none' : 'unset') + '"><a  class="chip" href="/#future=' + (l + 1) + '"><i id="pagination" class="fas fa-chevron-right"></i></a></div></div></div></div>';
      $main.innerHTML += '<div class="col s12"><div class="card"><div style="display:' + ((l == 1) ? 'none' : 'unset') + '" ><a class="chip" href="/#future=' + (l - 1) + '"><i id="pagination" class="fas fa-chevron-left"></i></a></div><a class="chip">Page ' + l + '</a><div style="display:' + ((l == Math.ceil(a.total / m)) ? 'none' : 'unset') + '"><a  class="chip" href="/#future=' + (l + 1) + '"><i id="pagination" class="fas fa-chevron-right"></i></a></div></div></div>'
    }

    //preload next action;
    load("launch?mode=verbose&limit=" + m + (k ? "&sort=desc&status=3,4,7" : "&status=1,2,5,6") + "&offset=" + (m * l));
  });



}

function watch(j, k) {
  k = k || "live"

  var $live = document.createElement("div");
  $live.id = "live";
  $main.className = ""
  $main.innerHTML = "";
  $main.appendChild($live);

  load((k.match("custom")) ? (j + "?format=customlive") : ("launch?mode=verbose" + (parseInt(j) ? ("&id=" + j) : ("&limit=1&name=" + j)) + "&format=" + (($query.mode == "countdown") ? "" : k)), function (e) {

    var a = e.launches[0];

    var changed = a.changed;

    refreshLaunch = function () {

      for (var d in window.countdowns) {
        window.clearInterval(window.countdowns[d]);
      }
      watch(j, k);
    }

    updateCountdown = function () {
      load("launch?mode=summary" + (parseInt(j) ? ("&id=" + j) : ("&limit=1&name=" + j)) + "&changed=" + ISODateString(Date.parse(changed) + 1000).replace("T", " ").split(".")[0], function (refreshdata) {

        if (refreshdata.status != "error") {
          b = refreshdata.launches[0];

          if (b) {
            console.log("Updating Countdown");

            for (var d in window.countdowns) {
              window.clearInterval(window.countdowns[d]);
            }

            countdown.innerHTML = b.status;

            changed = b.changed

            if (b.statuscode == 1 || b.statuscode == 6) {
              M.toast({
                html: "Updated Countdown"
              });
              count = setInterval(function () {
                var o = Math.floor((Date.parse(b.net) - Date.parse(new Date())) / 1000);
                document.title = "[" + Countdown(b.net) + "] " + b.name.split("|")[1];
                countdown.innerHTML = Countdown(b.net)
              }, 1000);
              window.countdowns.push(count);
            } else if (b.net != a.net) {
              location.reload();
            }
          }
        }
      })
    }


    document.title = a.name;

    document.getElementById("richEmbed").innerHTML = '{ "@context": "https://schema.org", "@type": "Article", "name": "' + a.name + '", "headline": "Live Launch Updates", "datePublished": "' + a.isostart + '", "dateModified": "' + ISODateString(new Date()).split(".")[0] + '+00:00", "image": "' + a.agency.icon + '", "url": "' + location.href + '", "articleBody": "' + a.description + '", "author": { "@type": "Organization", "name": "' + a.agency.name + '" }, "publisher" : { "@type" : "Organization", "name" : "rocket.watch", "logo": {"@type": "ImageObject", "url":location.origin + "/logo.png"} }, "mainEntityOfPage": {"@type": "mainEntityOfPage", "@id":location.origin + "/"} }';

    //document.getElementById("richEmbed").innerHTML = '{ "@context": "https://schema.org", "@type": "Event", "name": "' + a.name + '", "startDate": "' + a.isostart + '", "url": "' + location.href + '", "location": { "@type": "Place", "name": "' + a.location.name + '", "address": { "@type": "GeoCoordinates", "latitude": "' + a.location.pads[0].latitude + '", "longitude": "' + a.location.pads[0].longitude + '" } }, "image": "' + a.location.img + '", "description": "' + a.description + '", "endDate": "' + a.isoend + '", "performer": { "@type": "PerformingGroup", "name": "' + a.agency.name + '" } }';


    $info.innerHTML = '<div id="video"></div><div id="details" class="card-content"><h1><a class="tooltipped" data-tooltip="More info" href="/#rocket=' + a.rocket.id + '">' + a.name.replace("|", "</a> | ") + '</h1><h3 id="countdown' + a.id + '">' + a.status + '</h3><div id="chips"><a class="chip" href="javascript:window.history.back();"><i class="fas fa-arrow-alt-circle-left"></i>Go Back</a><a class="chip" onclick="refreshLaunch()"><i class="fas fa-sync"></i>Refresh</a><a class="chip tooltipped" data-tooltip="More info" href="/#agency=' + a.agency.id + '"><img src="' + a.agency.icon + '?size=32" onerror=this.onerror=null;this.src="' + a.agency.countryFlag + '">' + a.agency.name + '</a><a class="chip tooltipped" data-tooltip="More info" href="/#pad=' + (a.location.pads && a.location.pads[0].id) + '"><i class="far fa-compass"></i>' + a.location.pads[0].name + '</a><a class="chip tooltipped" id="launchdate" data-tooltip="' + a.net + '"><i class="far fa-clock"></i>' + ReadableDateString(a.net) + '</a></div><p class="flow-text" id="description">' + a.description + '</p></div><div id="buttons"></div><div class="card-tabs"><ul id="maintabs" class="tabs tabs-fixed-width"></ul></div></div>';

    var livevideo = document.querySelector("#video");
    var details = document.querySelector("#details");
    var buttons = document.querySelector("#buttons");
    var countdown = document.querySelector("#countdown" + a.id);
    var description = document.querySelector("#description");
    var badges = document.querySelector("#chips");
    var tabs = document.querySelector("#maintabs");


    if (navigator.share) {
      buttons.innerHTML += '<a class="waves-effect waves-light btn hoverable" onclick="window.share()"><i class="fas fa-share-alt"></i></a>';
      window.share = function () {
        navigator.share({
          title: a.name,
          text: a.description,
          url: location.href
        })
      }
    }

    if (a.tbdtime != 1) {
      if ($query.mode == "countdown") {
        buttons.innerHTML += '<a class="waves-effect waves-light btn hoverable tooltipped" href="/' + (location.search || location.hash).replace("&mode=countdown", "") + '" data-tooltip="Load live sources">Exit countdown mode</a>'
      } else if (!$query.mode && a.statuscode != 3 && a.statuscode != 4 && a.statuscode != 7) {
        buttons.innerHTML += '<a class="waves-effect waves-light btn hoverable" href="/' + (location.search || location.hash) + '&mode=countdown">Countdown only</a>'
      }

      if ($query.mode == "tv") {
        description.style.display = "none";
        buttons.innerHTML += '<a class="waves-effect waves-light btn hoverable" href="/' + (location.search || location.hash).replace("&mode=tv", "") + '">Exit TV mode</a>'
      } else if (!$query.mode && a.statuscode != 3 && a.statuscode != 4 && a.statuscode != 7 && (a.media.video || a.media.comments) && window.innerWidth >= 800) {
        buttons.innerHTML += '<a class="waves-effect waves-light btn hoverable tooltipped" href="/' + (location.search || location.hash) + '&mode=tv" data-tooltip="Display more data on one screen">TV mode</a>'
      }
    }

    buttons.innerHTML += '<a class="waves-effect waves-light btn hoverable" onclick="(details.style.display = details.style.display == \'none\' ? \'unset\' : \'none\')">Toggle Details</a>';

    if (a.statuscode == 1 || a.statuscode == 6) {
      count = setInterval(function () {
        var o = Math.floor((Date.parse(a.net) - Date.parse(new Date())) / 1000);
        document.title = "[" + Countdown(a.net) + "] " + a.name.split("|")[1];
        countdown.innerHTML = Countdown(a.net)
      }, 1000);
      window.countdowns.push(count);


      updatecount = setInterval(function () {
        updateCountdown();
      }, 60000);
      window.countdowns.push(updatecount);

    }

    if ($query.mode == "countdown") {
      countdown.style = "font-size: 10rem;";
      return
    }

    for (var b in a.media.badge) {
      var d = a.media.badge[b];
      badges.innerHTML += '<a class="chip ' + (d.desc ? 'tooltipped" data-tooltip="' + d.desc + '"' : '"') + ' ' + (d.url ? 'href="' + d.url + '"' : '') + '>' + (d.img ? '<img src="' + d.img + '">' : '') + (d.name || '') + "</a>"
    }

    for (var b in a.media.button) {
      var d = a.media.button[b];
      buttons.innerHTML += '<a class="waves-effect waves-light btn hoverable" href="' + d.url + '" target="_blank">' + d.name + '</a>';
    }

    if (navigator.onLine) {

      var list = a.media.video.concat(a.media.info).concat(a.media.comments).concat(a.media.last);
      var video = a.media.video;
      var media = a.media.info.concat(a.media.comments).concat(a.media.last);

      if (media.length) {
        document.getElementById("maintabs").innerHTML += '<li class="tab"><a href="#live" class="active">Live</a></li><li class="tab"><a href="#information">Info</a></li>';
      } else {
        document.getElementById("maintabs").innerHTML += '<li class="tab"><a href="#information">Info</a></li>';
      }
      var $information = document.createElement("div");
      $information.id = "information";
      $main.appendChild($information);
      materialize()

      if (a.missions[0] && a.missions[0].wikiURL) {
        $information.innerHTML += '<div class="container"><div class="card"><div class="video-container"><iframe src="' + a.missions[0].wikiURL.replace("http://", "https://") + '"  allow="autoplay; fullscreen"></iframe></div></div>';
      }
      if (a.rocket.wiki) {
        $information.innerHTML += '<div class="container"><div class="card"><div class="video-container"><iframe src="' + a.rocket.wiki + '" allow="autoplay; fullscreen"></iframe></div></div>';
      }
      $information.innerHTML += '<div class="container"><div class="card"><div class="video-container"><iframe src="' + a.location.map + '"  allow="autoplay; fullscreen"></iframe></div></div>';
      if (a.location.wikiURL || a.location.pads[0].wikiURL) {
        $information.innerHTML += '<div class="container"><div class="card"><div class="video-container"><iframe src="' + (a.location.wikiURL || a.location.pads[0].wikiURL).replace("http://", "https://") + '"  allow="autoplay; fullscreen"></iframe></div></div>';
      }
      if (a.agency.wiki) {
        $information.innerHTML += '<div class="container"><div class="card"><div class="video-container"><iframe src="' + a.agency.wiki + '"  allow="autoplay; fullscreen"></iframe></div></div>';
      }

      var medialist = "<option disabled selected>Select source</option>";
      for (var e in list) {
        medialist += "<option value='" + e + "'>" + list[e].name.slice(0, 100) + "</option>";
      }

      selectSource = function (o) {
        e = parseInt(document.getElementById(o + "_select").value);
        window.open(list[e].embed, o);
        document.getElementById(o + "_reload").href = list[e].embed;
        document.getElementById(o + "_share").href = list[e].share
        document.getElementById(o).innerHTML = '<iframe name="' + o + '" src="' + list[e].embed + '"  allow="autoplay; fullscreen"></iframe>'
      };

      if (video.length) {
        if ($query.mode == "tv" && a.media.video.length > 1) {
          livevideo.innerHTML = '<div class="col s12 m10 offset-m1 l6"><div class="video-container" id="videoframe1"><iframe name="videoframe1" src="' + ((video[0].embed.match("\\?")) ? (video[0].embed + "&autoplay=1") : (video[0].embed + "?autoplay=1")) + '"  allow="autoplay; fullscreen"></iframe></div><div class="cardnav"><a id="videoframe1_reload" href="' + video[0].embed + '" target="videoframe1"><i class="fas fa-sync-alt"></i></a><a id="videoframe1_share" href="' + video[0].share + '" target="_blank"><i class="fas fa-external-link-square-alt"></i></a><select id="videoframe1_select" onchange="selectSource(\'videoframe1\')">' + medialist + '</select></div></div></div>' + livevideo.innerHTML;
          livevideo.innerHTML = '<div class="col s12 m10 offset-m1 l6"><div class="video-container" id="videoframe2"><iframe name="videoframe2" src="' + ((video[1].embed.match("\\?")) ? (video[1].embed + "&autoplay=1") : (video[1].embed + "?autoplay=1")) + '"  allow="autoplay; fullscreen"></iframe></div><div class="cardnav"><a id="videoframe2_reload" href="' + video[1].embed + '" target="videoframe2"><i class="fas fa-sync-alt"></i></a><a id="videoframe2_share" href="' + video[1].share + '" target="_blank"><i class="fas fa-external-link-square-alt"></i></a><select id="videoframe2_select" onchange="selectSource(\'videoframe2\')">' + medialist + '</select></div></div></div>' + livevideo.innerHTML;
        } else {
          livevideo.innerHTML = '<div class="video-container" id="videoframe1"><iframe name="videoframe1" src="' + ((video[0].embed.match("\\?")) ? (video[0].embed + "&autoplay=1") : (video[0].embed + "?autoplay=1")) + '"  allow="autoplay; fullscreen"></iframe></div><div class="cardnav"><a id="videoframe1_reload" href="' + video[0].embed + '" target="videoframe1"><i class="fas fa-sync-alt"></i></a><a id="videoframe1_share" href="' + video[0].share + '" target="_blank"><i class="fas fa-external-link-square-alt"></i></a>' + ((a.media.video.length > 1) ? ('<select id="videoframe1_select" onchange="selectSource(\'videoframe1\')">' + medialist + '</select>') : '') + '</div></div></div>' + livevideo.innerHTML;
        }
      }

      if (media.length) {
        if ($query.mode == "tv" && media.length > 1) {
          $live.innerHTML += '<div class="col s12 m10 offset-m1 l6"><div class="card"><div class="video-container" id="contentframe1"><iframe name="contentframe1" src="' + media[0].embed + '"  allow="autoplay; fullscreen"></iframe></div><div class="cardnav"><a id="contentframe1_reload" href="' + media[0].embed + '" target="contentframe1"><i class="fas fa-sync-alt"></i></a><a id="contentframe1_share" href="' + media[0].share + '" target="_blank"><i class="fas fa-external-link-square-alt"></i></a><select id="contentframe1_select" onchange="selectSource(\'contentframe1\')">' + medialist + '</select></div></div></div></div>';
          $live.innerHTML += '<div class="col s12 m10 offset-m1 l6"><div class="card"><div class="video-container" id="contentframe2"><iframe name="contentframe2" src="' + media[media.length - 1].embed + '"  allow="autoplay; fullscreen"></iframe></div><div class="cardnav"><a id="contentframe2_reload" href="' + media[media.length - 1].embed + '" target="contentframe2"><i class="fas fa-sync-alt"></i></a><a id="contentframe2_share" href="' + media[media.length - 1].share + '" target="_blank"><i class="fas fa-external-link-square-alt"></i></a><select id="contentframe2_select" onchange="selectSource(\'contentframe2\')">' + medialist + '</select></div></div></div></div>';
        } else {
          $live.innerHTML += '<div class="container"><div class="card"><div class="video-container" id="contentframe1"><iframe name="contentframe1" src="' + media[0].embed + '"  allow="autoplay; fullscreen"></iframe></div><div class="cardnav"><a id="contentframe1_reload" href="' + media[0].embed + '" target="contentframe1"><i class="fas fa-sync-alt"></i></a><a id="contentframe1_share" href="' + media[0].share + '" target="_blank"><i class="fas fa-external-link-square-alt"></i></a><select id="contentframe1_select" onchange="selectSource(\'contentframe1\')">' + medialist + '</select></div></div></div></div>';

          if (media.length > 1 && a.statuscode != 3 && a.statuscode != 4 && a.statuscode != 7) {
            $live.innerHTML += '<div class="container"><div class="card"><div class="video-container" id="contentframe2"><iframe name="contentframe2" src="' + media[media.length - 1].embed + '"  allow="autoplay; fullscreen"></iframe></div><div class="cardnav"><a id="contentframe2_reload" href="' + media[media.length - 1].embed + '" target="contentframe2"><i class="fas fa-sync-alt"></i></a><a id="contentframe2_share" href="' + media[media.length - 1].share + '" target="_blank"><i class="fas fa-external-link-square-alt"></i></a><select id="contentframe2_select" onchange="selectSource(\'contentframe2\')">' + medialist + '</select></div></div></div></div>';
          }

        }
      }

      if (a.media.audio.length) {
        var c = document.createElement("div");
        c.className = "container row";
        c.style = "padding: 0 !important";
        for (var b in a.media.audio) {
          c.innerHTML += '<div class="col s12 m' + Math.floor(12 / a.media.audio.length) + '"><div class="card-panel"><audio style="width:100%" controls preload="none"><source src="' + a.media.audio[b].embed + '"></audio></br><div class="cardnav"><a class="truncate">' + a.media.audio[b].name + "</a></div></div></div>"
        }
        $live.appendChild(c)
      }

      if (a.media.twitter.length) {
        var y = document.createElement("div");
        $live.appendChild(y);

        if (!($query.mode == "tv" && media.length >= 2)) {
          y.className = "container";
        }
        for (var b in a.media.twitter) {
          y.innerHTML += '<div class="col s12 m' + Math.floor(12 / a.media.twitter.length) + '"><div class="card"><div class="video-container"><a class="twitter-timeline" data-dnt="true" href="' + a.media.twitter[b].url + '" ' + ($settings.dark ? " data-theme=\"dark\"" : "") + '></a></div></div></div>';
        }
        if (typeof twttr != undefined) {
          twttr.widgets.load();
        }
      }



    } else {
      $main.className = "valign-wrapper";
      $main.innerHTML += '<div class="container"><h1 class="white-text">You\'re offline :(</h1></div>'
    }

  })
}

function settings() {

  restart = function () {
    navigator.serviceWorker.getRegistrations().then(function (registrations) {
      for (let registration of registrations) {
        console.log(registration)
        registration.unregister()
      }
    });
    localStorage.clear();
    location.reload(true);
  }

  $info.innerHTML = '<div class="card-content"><img class="circle" src="res/settings.png" onerror=this.onerror=null;this.display="none"><h1 class="header black-text truncate">Settings</h1><div id="chips"><a class="chip" href="javascript:window.history.back();"><i class="fas fa-arrow-alt-circle-left"></i>Go Back</a></div>';

  $main.innerHTML = '<div class="card"><div class="card-content"><a class="waves-effect waves-light btn hoverable" onclick="restart()">Clear Settings and Site Data</a><a class="waves-effect waves-light btn hoverable" onclick="location.reload(true);">Reload</a></div></div>';

  $main.innerHTML += '<div class="card"><div class="card-content"> <h3 class="header">Preferences</h3><ul class="collection with-header" id="preferences"></ul></div><div class="card-action"><a class="waves-effect waves-light btn hoverable" onclick="syncValues();location.reload(true);">Save</a></div></div>';

  $main.innerHTML += '<div class="card"><div class="card-content"> <h3 class="header">Manage consent</h3><p class="flow-text">To comply with <a href="https://www.eugdpr.org/" target="_blank">EU\'s GDPR law</a>, We need to ask you for consent to use following services:</p> <ul class="collection"> <li class="collection-item avatar"> <i class="fas fa-archive circle yellow"></i> <span class="title">Cookies</span> <p>Allow us to save data between your sessions. (We need it to save your preferences below 😊 ) <a href="https://en.wikipedia.org/wiki/HTTP_cookie" target="_blank">What are cookies?</a></p> <a class="secondary-content"> <label> <input id="consent_cookie" type="checkbox" disabled="" checked=""> <span>Allow</span> </label></a> </li> <li class="collection-item avatar"> <i class="far fa-chart-bar circle green"></i> <span class="title">Google Analytics</span> <p>Gives us an insight into how users use the site. Data collected is 100% anonymous and is not used to target you. <a href="https://policies.google.com/privacy" target="_blank">Read the service Privacy Policy here.</a></p> <a href="#!" class="secondary-content"></a><a class="secondary-content"><label> <input id="consent_analytics" type="checkbox" checked=""> <span>Allow</span> </label></a> </li> <li class="collection-item avatar"> <i class="fab fa-google circle blue"></i> <span class="title">Google Ads</span> <p>Allows us to monetize the site content via 2 ad blocks. If you don\'t want it, consider supporting us on <a style="color:#F96854 !important" href="https://www.patreon.com/bePatron?u=3533463" target="_blank">Patreon!</a> <a href="https://policies.google.com/privacy" target="_blank">Read the service Privacy Policy here.</a></p> <a href="#!" class="secondary-content"></a><a class="secondary-content"> <label> <input id="consent_ads" type="checkbox" checked=""> <span>Allow</span> </label></a> </li> <li class="collection-item avatar"> <i class="far fa-bell circle red"></i> <span class="title">OneSignal</span> <p>Get launch notifications and updates about launches and spaceflight news right to your device. <a href="https://onesignal.com/privacy_policy" target="_blank">Read the service Privacy Policy here.</a></p> <a class="secondary-content"> <label> <input id="consent_onesignal" type="checkbox" checked=""> <span>Allow</span> </label></a> </li> <li class="collection-item avatar"> <i class="fas fa-video circle orange"></i> <span class="title">Vidpulse</span> <p>Video recomendations at the end of each launch videos - helps you find more great content! <a href="https://www.vidpulse.com/privacy.html" target="_blank">Read the service Privacy Policy here.</a></p> <a class="secondary-content"> <label> <input id="consent_vidpulse" type="checkbox" checked=""> <span>Allow</span> </label></a> </li> <li class="collection-item avatar"> <i class="fab fa-twitter circle yellow"></i> <span class="title"><a href="https://policies.google.com/privacy" target="_blank">YouTube</a>, <a href="https://twitter.com/en/privacy" target="_blank">Twitter</a>, <a href="https://widgetbot.io/legal/privacy-policy/" target="_blank">Widgetbot</a> and other embeds on this site.</span> <p>Embeds and widgets provide the core functionality of this site. 3rd pary scripts allow us to embed Twitter, Reddit and Discord feeds right on the site. </p> <a class="secondary-content"> <label> <input id="consent_thirdparty" type="checkbox" checked="" disabled=""> <span>Allow</span> </label></a> </li> </ul> <p class="flow-text">This site itself does not store nor process any user data. The services you give us consent to use help enrich your experience and give us insight into what we should improve on. If you have any questions, join our <a style="color:#7289DA !important" href="https://discord.io/rocketwatch" target="_blank">Discord server</a> or contact us <a href="mailto:contact@rocket.watch" target="_blank">via email</a>.</p> </div> <div class="card-action"> <a onclick="processConsent();syncValues();" class="modal-action modal-close waves-effect btn">Save</a></div>';

  var settings_names = {
    dark: "Dark Mode",
    notifications_launches: "Launch Notifications",
    notifications_launches_webcast: "Launches with webcasts only",
    notifications_launches_60: "1 Hour Notification",
    notifications_launches_24: "24 Hour Notification",
    notifications_launches_20: "20 Minutes Notification",
    notifications_news: "News Notifications"
  };

  for (var i in $settings) {
    document.getElementById("preferences").innerHTML += '<li class="collection-item"><p><label><input onclick="saveValue(this.id, this.checked)" type="checkbox" id="' + i + '" ' + (($settings[i]) ? "checked" : "") + ' /><span>' + (settings_names[i] ? settings_names[i] : i) + '</span></label></p></li>';
  }

  var data = JSON.parse(localStorage.getItem("consent-v" + consentVersion));
  if (data) {
    document.querySelector('#consent_analytics').checked = data.analytics;
    document.querySelector('#consent_ads').checked = data.ads;
    document.querySelector('#consent_onesignal').checked = data.onesignal;
    document.querySelector('#consent_vidpulse').checked = data.vidpulse;
    document.querySelector('#consent_thirdparty').checked = data.thirdparty;
  } else {
    M.toast({
      html: "You have not saved your consent preferences yet!"
    })
  }
}

//Libs
function saveValue(key, value) {
  $settings = JSON.parse(localStorage.getItem("rocketwatch.Settings.v2"));
  $settings[key] = value;
  localStorage.setItem("rocketwatch.Settings.v2", JSON.stringify($settings));
  M.toast({
    html: "Saved! " + key + ": " + value
  });
  console.log(key + ": " + value);
  syncValues();
  location.reload(true);
}

function syncValues() {
  (window.OneSignal = window.OneSignal || []).push(function () {
    OneSignal.push(function () {
      if (localStorage.getItem("rocketwatch.Settings.v2")) {
        OneSignal.isPushNotificationsEnabled(function (isEnabled) {
          var $consent = JSON.parse(localStorage.getItem("consent-v" + consentVersion));
          var $settings = JSON.parse(localStorage.getItem("rocketwatch.Settings.v2"));
          if ($settings && isEnabled) {
            OneSignal.sendTags(Object.assign($settings, $consent)).then(function (tagsSent) {
              console.log("[Settings] Tags synchronised");
              console.log(tagsSent);
            });
          }
        });
      }
    })
  });
}

function materialize() {
  M.Sidenav.init(document.querySelector('.sidenav'));
  M.Sidenav.getInstance(document.querySelector('.sidenav')).close()
  M.Materialbox.init(document.querySelectorAll('.materialboxed'));
  M.Tabs.init(document.querySelectorAll('ul.tabs'));
  M.Tooltip.init(document.querySelectorAll('.tooltipped'));
}

function ISODateString(c) {
  c = new Date(c)

  function d(a) {
    return a < 10 ? "0" + a : a
  }
  return c.toISOString() || (c.getUTCFullYear() + "-" + d(c.getUTCMonth() + 1) + "-" + d(c.getUTCDate()) + "T" + d(c.getUTCHours()) + ":" + d(c.getUTCMinutes()) + ":" + d(c.getUTCSeconds()) + "Z")
}

function ReadableDateString(f) {
  var e = new Date(f);
  var d = e.getFullYear() + "-" + ("0" + (e.getMonth() + 1)).slice(-2) + "-" + ("0" + e.getDate()).slice(-2) + " " + ("0" + e.getHours()).slice(-2) + ":" + ("0" + e.getMinutes()).slice(-2) + ":" + ("0" + e.getSeconds()).slice(-2);
  return d
  /*
  if (e.toLocaleString()) {
    return e.toLocaleString(undefined, {
      timeZoneName: "short"
    });
  } else {

    var d = e.getFullYear() + "/" + ("0" + (e.getMonth() + 1)).slice(-2) + "/" + ("0" + e.getDate()).slice(-2) + ", " + ("0" + e.getHours()).slice(-2) + ":" + ("0" + e.getMinutes()).slice(-2) + ":" + ("0" + e.getSeconds()).slice(-2);
    return d
  }
  */
}

function Countdown(c, d) {
  padnumber = function (f, b) {
    var a = f + "";
    while (a.length < b) {
      a = "0" + a
    }
    return a
  };
  count = function (u) {
    var r;
    var a = Date.parse(u);
    var q = new Date(ServerDate.now());
    var o = Math.floor((a - q) / 1000);
    var s = "L- ";
    if (o <= 0) {
      s = "L+ ";
      o = Math.floor((q - a) / 1000)
    }
    var t = Math.floor(o / 60);
    var p = Math.floor(t / 60);
    var b = Math.floor(p / 24);
    var v = padnumber((o % 60), 2);
    if (o < 60) {
      r = s + v
    }
    v = padnumber((t % 60), 2) + ":" + v;
    if (t < 60) {
      r = s + v
    }
    v = padnumber((p % 24), 2) + ":" + v;
    if (p < 24) {
      r = s + v
    }
    if (b > 1) {
      r = s + b + " days " + v
    } else {
      if (b == 1) {
        r = s + b + " day " + v
      }
    }
    return r
  };
  if (d) {
    countdown = setInterval(function () {
      (document.getElementById(d) || d).innerHTML = count(c)
    }, 1000);
    window.countdowns.push(countdown)
  }
  return count(c)
}

function QueryString(callback, url) {
  var g = {};
  var l = (url && url.split("?")[1]) || (window.location.search || location.hash).substring(1);
  var k = l.split("&");
  for (var m = 0; m < k.length; m++) {
    var j = k[m].split("=");
    if (typeof g[j[0]] === "undefined") {
      g[j[0]] = decodeURIComponent(j[1])
    } else {
      if (typeof g[j[0]] === "string") {
        var h = [g[j[0]], decodeURIComponent(j[1])];
        g[j[0]] = h
      } else {
        g[j[0]].push(decodeURIComponent(j[1]))
      }
    }
  }
  if (callback) callback(g);
  return g
}

function load(query, callback) {
  getJSON(backendURL + query, function (data) {
    if (callback) callback(data);
    return data;
  });
}

function getJSON(url, callback) {
  try {
    var k = new XMLHttpRequest()
    k.onreadystatechange = function () {
      if (k.readyState === 4) {
        if (k.responseText.split()[0] == "{" || k.status == 200) {
          var a = JSON.parse(k.responseText);
          a.timestamp = Date.now();
          callback(a)
        } else {
          var a = {
            timestamp: Date.now(),
            status: (k.status || "error"),
            code: k.statusText,
            msg: k.responseText
          };
          callback(a);
          console.log(a)
        }
      }
    };
    k.open("GET", url);
    k.send()
  } catch (e) {
    console.log(e)
  }
};

//Service Worker registration = cache shell, offline pwa
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker
      .register('/OneSignalSDKWorker.js')
      .then(function () {
        console.log('rocket.watch serviceworker install successful');
      })

      .catch(function (err) {
        console.log('rocket.watch serviceworker install failed: ', err);
      });
  });
}
