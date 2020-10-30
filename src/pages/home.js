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

    load("launch/upcoming/?limit=4", function (data) {
        if (data.results && data.results.length) {
            const launches = data.results;
            const first_launch = launches[0];
            $info.innerHTML =
            `<div id="video"></div>
            <div class="card-content">
                <h1>
                    <a class="tooltipped" data-tooltip="More Info" href="/#rocket=${first_launch.rocket.id}">${first_launch.name.replace("|", "</a>|")}
                </h1>
                <h3 id="countdown${first_launch.launch_library_id}">
                    ${first_launch.status.name}
                </h3>
                <div id="chips">
                    <a class="chip" id="refreshHome">
                        <i class="fas fa-sync"></i>
                        Refresh
                    </a>
                    <a class="chip tooltipped" data-tooltip="More info" href="/#agency=${first_launch.launch_service_provider.id}">
                        ${first_launch.launch_service_provider.name}
                    </a>
                    <a class="chip tooltipped" data-tooltip="More info" href="/#pad=${first_launch.pad.id}">
                        <i class="far fa-compass"></i>
                        ${first_launch.pad.location.name}
                    </a>
                    <a class="chip tooltipped" id="launchdate" data-tooltip="${first_launch.net}">
                        <i class="far fa-clock"></i>
                        ${ReadableDateString(first_launch.net)}
                    </a>
                </div>
                <p class="flow-text">
                    ${first_launch.mission && first_launch.mission.description || ""}
                </p>
            </div>
            <div id="card-action" class="card-action">
                <a class="waves-effect waves-light btn hoverable" href="/#id=${first_launch.launch_library_id}">
                    Details
                </a>
                <a class="waves-effect waves-light btn hoverable" href="/#live=${first_launch.launch_library_id}">
                    Live mode
                </a>
                <a class="waves-effect waves-light btn hoverable" href="/#countdown=${first_launch.launch_library_id}">
                    Countdown
                </a>
            </div>`;
            
            for (let launch of launches) {
                if (launch.status.id == 1 || launch.status.id == 6) {
                    new Countdown(launch.net, "countdown" + launch.launch_library_id)
                }
                if (launch.status.id != 2 && active == 0) {
                    $info.innerHTML = 
                    `<div id="video"></div>
                    <div class="card-content">
                        <h1>
                            <a class="tooltipped" data-tooltip="More Info" href="/#rocket=${launch.rocket.id}">${launch.name.replace("|", "</a>|")}
                        </h1>
                        <h3 id="countdown${launch.launch_library_id}">
                            ${launch.status.name}
                        </h3>
                        <div id="chips">
                            <a class="chip" id="refreshHome">
                                <i class="fas fa-sync"></i>
                                Refresh
                            </a>
                            <a class="chip tooltipped" data-tooltip="More info" href="/#agency=${launch.launch_service_provider.id}">
                                ${launch.launch_service_provider.name}
                            </a>
                            <a class="chip tooltipped" data-tooltip="More info" href="/#pad=${launch.pad.location.id}">
                                <i class="far fa-compass"></i>
                                ${launch.pad.location.name}
                            </a>
                            <a class="chip tooltipped" id="launchdate" data-tooltip="${launch.net}">
                                <i class="far fa-clock"></i>
                                ${ReadableDateString(launch.net)}
                            </a>
                        </div>
                        <p class="flow-text">
                            ${first_launch.mission && first_launch.mission.description || ""}
                        </p>
                    </div>
                    <div id="card-action" class="card-action">
                        <a class="waves-effect waves-light btn hoverable" href="/#id=${launch.launch_library_id}">
                            Details
                        </a>
                        <a class="waves-effect waves-light btn hoverable" href="/#live=${launch.launch_library_id}">
                            Live mode
                        </a>
                        <a class="waves-effect waves-light btn hoverable" href="/#countdown=${launch.launch_library_id}">
                            Countdown
                        </a>
                    </div>`;

                    document.getElementById("refreshHome").onclick = refreshHome
                    /*
                    if (g.vidURLs[0] && g.vidURLs[0].match("youtube.com") && !g.vidURLs[0].match("/live")) {
                       document.querySelector("#video").innerHTML = `<div class="video-container" id="videoframe1"><iframe name="videoframe1" src="${g.vidURLs[0].replace("watch?v=", "embed/")}"  allow="autoplay; fullscreen"></iframe></div><div class="cardnav"><a id="videoframe1_reload" href="${g.vidURLs[0].replace("watch?v=", "embed/")}?autoplay=1" target="videoframe1"><i class="fas fa-sync-alt"></i></a><a id="videoframe1_share" href="${g.vidURLs[0]}" target="_blank"><i class="fas fa-external-link-square-alt"></i></a></div></div>`;
                    }
                    */
                    active++;
                    continue
                }

                if (total == (data.total - active)) break
                //$main.innerHTML = `<ul class="tabs"><li class="tab"><a href="#future" target="_self" class="active">More Launches</a></li></ul>${$main.innerHTML}`;
                $upcoming.innerHTML += 
                `<div class="col s12 l${Math.floor(12 / (data.results.length - active))}">
                    <div class="card">
                        <div class="card-content">
                            <h5 class="header truncate"><a class="tooltipped" data-tooltip="More Info" href="/#rocket=${launch.rocket.name}">${launch.name.replace(" | ", "</a></h5><h4 class='header truncate'>").split(" (")[0]}</h4>
                            <a class="chip tooltipped" data-tooltip="${launch.launch_service_provider.name}" href="/#agency=${launch.launch_service_provider.id}">
                                ${launch.launch_service_provider.name}
                            </a>
                            <a class="chip tooltipped" data-tooltip="${launch.pad.name}" href="/#pad=${launch.pad.location.id}">
                                <i class="far fa-compass"></i>
                                ${launch.pad.location.name.split(",")[0]}
                            </a>
                            </br>
                            <a class="chip tooltipped" data-tooltip="${launch.net}">
                                <i class="far fa-clock"></i>
                                ${ReadableDateString(launch.net)}
                            </a>
                            <h5 id="countdown${launch.launch_library_id}">
                                ${launch.status.name}
                            </h5>
                        </div>
                        <div class="card-action">
                            <a class="waves-effect waves-light btn hoverable" href="/#id=${launch.launch_library_id}">
                                Details</a>
                        </div>
                    </div>
                </div>`;
                total++;
            }
        } else {
            $info.innerHTML = `<h1 class="white-text">${data.detail}</h1>`;
        }
    });

    load("launch/previous/?limit=4", function (data) {
        $successful.innerHTML = `<ul class="tabs"><li class="tab"><a href="#history" target="_self" class="active">Recent Launches</a></li></ul>`;
        for (let launch of data.results) {
            let days = Math.floor((new Date() - new Date(launch.net)) / 86400000);
            $successful.innerHTML += `<div class="col s12 m6 l3"><div class="card"><div class="card-content"><h5 class="header truncate"><a class="tooltipped" data-tooltip="More info" href="/#rocket=${launch.name.split(" |")[0].split("/")[0]}">${launch.name.replace(" | ", "</a></h5><h4 class='header truncate'>").split(" (")[0]}</h4><a class="chip tooltipped" data-tooltip="${launch.net}"><i class="far fa-clock"></i>${ReadableDateString(launch.net)}</a></br><a class="chip">${(days > 0) ? days + " Days ago" : "Today"}</a><h5>${launch.status.name}</h5></div><div class="card-action"><a class="waves-effect waves-light btn hoverable" href="/#id=${launch.launch_library_id}">Watch</a></div></div>`;
        }

        for (let i = 1; i <= ($successful.childElementCount - 1); i++) {
            $successful.children[i].className = `col s12 l${Math.floor(12 / ($successful.childElementCount - 1))}`;
        }
    });


    if (sources.featuring) {
        $featured.innerHTML = `<ul class="tabs"><li class="tab"><a class="active">Featured</a></li></ul>`;
        for (let a in sources.featuring) {
            $featured.innerHTML += 
            `<div class="col s12 m6 l4">
                <div class="card">
                    <div class="card-content">
                        <img class="circle logo" src="${sources.featuring[a].img}" onerror=this.onerror=null;this.src="">
                        <h5 class="header truncate">
                            ${sources.featuring[a].name}
                        </h5>
                        <a class="max2lines">
                            ${sources.featuring[a].desc}
                        </a>
                    </div>
                    <div class="card-action">
                        <a class="waves-effect waves-light btn hoverable" href="${sources.featuring[a].url}">
                            ${sources.featuring[a].action}
                        </a>
                    </div>
                </div>
            </div>`;
        }
    }

    materialize()
}