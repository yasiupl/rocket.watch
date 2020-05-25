import { load, materialize, ReadableDateString, Countdown } from '../js/utils'
const sources = require('../sources.json');

export default function home() {
    let $main = document.getElementsByTagName("main")[0];
    let $info = document.getElementById("info");
    let total = 0;
    let active = 0;
    $main.innerHTML = '';
    let $upcoming = document.createElement("div");
    $upcoming.id = "upcoming";
    $main.appendChild($upcoming);

    let $successful = document.createElement("div");
    $successful.id = "successful";
    $main.appendChild($successful);
    let $featured = document.createElement("div");
    $featured.id = "featured";
    $main.appendChild($featured);

    let refreshHome = function () {
        for (let d in countdowns) {
            window.clearInterval(countdowns[d]);
        }
        home();
    }

    load("launch/next/4?status=1,2,5,6", function (f) {
        if (f.launches && f.launches.length) {
            for (let g of f.launches) {
                if (g.statuscode == 1 || g.statuscode == 6) {
                    new Countdown(g.net, "countdown" + g.id)
                }
                if (g.statuscode != 2 && active == 0) {
                    $info.innerHTML = `<div id="video"></div><div class="card-content"><h1><a class="tooltipped" data-tooltip="More Info" href="/#rocket=${g.rocket.id}">${g.name.replace("|", "</a>|")}</h1><h3 id="countdown${g.id}">${g.status}</h3><div id="chips"><a class="chip" id="refreshHome"><i class="fas fa-sync"></i>Refresh</a><a class="chip tooltipped" data-tooltip="More info" href="/#agency=${g.agency.id}"><img src="${g.agency.icon}?size=32" onerror=this.onerror=null;this.src="${g.agency.countryFlag}">${g.agency.name}</a><a class="chip tooltipped" data-tooltip="More info" href="/#pad=${g.location.pads && g.location.pads[0].id}"><i class="far fa-compass"></i>${g.location.pads[0].name}</a><a class="chip tooltipped" id="launchdate" data-tooltip="${g.net}"><i class="far fa-clock"></i>${ReadableDateString(g.net)}</a></div><p class="flow-text">${g.description}</p></div><div id="card-action" class="card-action"><a class="waves-effect waves-light btn hoverable" href="/#id=${g.id}">Details</a></div></div>`

                    document.getElementById("refreshHome").onclick = refreshHome

                    if (g.vidURLs[0] && g.vidURLs[0].match("youtube.com") && !g.vidURLs[0].match("/live")) {
                       document.querySelector("#video").innerHTML = `<div class="video-container" id="videoframe1"><iframe name="videoframe1" src="${g.vidURLs[0].replace("watch?v=", "embed/")}"  allow="autoplay; fullscreen"></iframe></div><div class="cardnav"><a id="videoframe1_reload" href="${g.vidURLs[0].replace("watch?v=", "embed/")}?autoplay=1" target="videoframe1"><i class="fas fa-sync-alt"></i></a><a id="videoframe1_share" href="${g.vidURLs[0]}" target="_blank"><i class="fas fa-external-link-square-alt"></i></a></div></div>`;
                    }
                    active++;
                    continue
                }

                if (total == (f.count - 1)) break
                //$main.innerHTML = `<ul class="tabs"><li class="tab"><a href="#future" target="_self" class="active">More Launches</a></li></ul>${$main.innerHTML}`;
                $upcoming.innerHTML += `<div class="col s12 l${Math.floor(12 / (f.count - 1))}"><div class="card"><div class="card-content"><h5 class="header truncate"><a class="tooltipped" data-tooltip="More Info" href="/#rocket=${g.rocket.name.split("/")[0]}">${g.name.replace(" | ", "</a></h5><h4 class='header truncate'>").split(" (")[0]}</h4><a class="chip tooltipped" data-tooltip="${g.agency.name}" href="/#agency=${g.agency.id}"><img src="${g.agency.icon}?size=32" onerror=this.src="${g.agency.countryFlag}">${g.agency.shortname}</a><a class="chip tooltipped" data-tooltip="${g.location.name}" href="/#pad=${g.location.pads[0].id}"><i class="far fa-compass"></i>${g.location.name.split(",")[0]}</a></br><a class="chip tooltipped" data-tooltip="${g.net}"><i class="far fa-clock"></i>${ReadableDateString(g.net)}</a><h5 id="countdown${g.id}">${g.status}</h5></div><div class="card-action"><a class="waves-effect waves-light btn hoverable" href="/#id=${g.id}">Details</button></div></div></div>`;

                total++;
            }
        } else {
            $info.innerHTML = '<h1 class="white-text">No Upcoming Launches</h1>'
        }
    });

    load("launch?limit=4&sort=desc&mode=summary&status=3,4,7", function (f) {
        $successful.innerHTML = `<ul class="tabs"><li class="tab"><a href="#history" target="_self" class="active">Recent Launches</a></li></ul>`;
        for (let i in f.launches) {
            let g = f.launches[i];
            let days = Math.floor((new Date() - new Date(g.net)) / 86400000);
            $successful.innerHTML += `<div class="col s12 m6 l3"><div class="card"><div class="card-content"><h5 class="header truncate"><a class="tooltipped" data-tooltip="More info" href="/#rocket=${g.name.split(" |")[0].split("/")[0]}">${g.name.replace(" | ", "</a></h5><h4 class='header truncate'>").split(" (")[0]}</h4><a class="chip tooltipped" data-tooltip="${g.net}"><i class="far fa-clock"></i>${ReadableDateString(g.net)}</a></br><a class="chip">${(days > 0) ? days + " Days ago" : "Today"}</a><h5>${g.status}</h5></div><div class="card-action"><a class="waves-effect waves-light btn hoverable" href="/#id=${g.id}">Watch</a></div></div>`;
        }

        for (let i = 1; i <= ($successful.childElementCount - 1); i++) {
            $successful.children[i].className = `col s12 l${Math.floor(12 / ($successful.childElementCount - 1))}`;
        }
    });


    if (sources.featuring) {
        $featured.innerHTML = `<ul class="tabs"><li class="tab"><a class="active">Featured</a></li></ul>`;
        for (let a in sources.featuring) {
            $featured.innerHTML += `<div class="col s12 m6 l4"><div class="card"><div class="card-content"><img class="circle logo" src="${sources.featuring[a].img}" onerror=this.onerror=null;this.src=""><h5 class="header truncate">${sources.featuring[a].name}</h5><a class="max2lines">${sources.featuring[a].desc}</a></div><div class="card-action"><a class="waves-effect waves-light btn hoverable" href="${sources.featuring[a].url}">${sources.featuring[a].action}</a></div></div>`
        }
    }

    materialize()
}