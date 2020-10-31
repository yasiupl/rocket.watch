import { QueryString, load, materialize, embedify, ISODateString, ReadableDateString, Countdown } from '../js/utils'
const sources = require('../sources.json');

export default function watch(id, mode = "live") {

    let $query = QueryString();

    let $main = document.getElementsByTagName("main")[0];
    let $info = document.getElementById("info");
    let $live = document.createElement("div");
    $live.id = "live";
    $main.className = "";
    $main.innerHTML = "";
    $main.appendChild($live);

    // fetch launch with an ID if the ID is a number, or fetch a custom file if the ID is a string. fetch lite version if only countdown should be displayed.
    load(`launch/?mode=detailed${(parseInt(id) ? ("&launch_library_id=" + id) : ("&limit=1&slug=" + id))}`, function (data) {

        let launch = data.results[0] || data;

        document.title = launch.name;

        $info.innerHTML = `<div id="feature"></div>
							<div id="details" class="card-content">
								<h1><a class="tooltipped" data-tooltip="More info" href="/#rocket=${launch.rocket.id}">${launch.name.replace("|", "</a> | ")}</h1>
								<h3 id="countdown-${launch.id}">${launch.status.name}</h3>
								<div id="chips">
                                    <a class="chip" href="javascript:window.history.back();"><i class="fas fa-arrow-alt-circle-left"></i>Go Back</a>
                                    <a class="chip tooltipped" data-tooltip="More info" href="/#agency=${launch.launch_service_provider.id}"><img src="${launch.launch_service_provider.logo_url}">${launch.launch_service_provider.name}</a>
									<a class="chip tooltipped" data-tooltip="More info" href="/#pad=${launch.pad.id}"><i class="far fa-compass"></i>${launch.pad.name}</a>
									<a class="chip tooltipped" id="launchdate" data-tooltip="${launch.net}"><i class="far fa-clock"></i>${ReadableDateString(launch.net)}</a>
								</div>
								<p class="flow-text" id="description"></p>
							</div>
							<div id="buttons"></div>
							<div class="card-tabs">
								<ul id="maintabs" class="tabs tabs-fixed-width"></ul>
							</div>`;

        let $feature = document.querySelector("#feature");
        let $buttons = document.querySelector("#buttons");
        let $countdown = document.querySelector("#countdown-" + launch.id);
        let $badges = document.querySelector("#chips");
        let $description = document.querySelector("#description");

        if (launch.probability != "-1" && [3, 4, 7].indexOf(launch.status.id) == -1) {
            $badges.innerHTML += `<a class="chip tooltipped" data-tooltip="Launch probability %">${launch.probability}% probability</a>`
        };

        if (navigator.share) {
            $buttons.innerHTML += '<a class="waves-effect waves-light btn hoverable" onclick="window.share()"><i class="fas fa-share-alt"></i></a>';
            window.share = function () {
                navigator.share({
                    title: launch.name,
                    text: launch.description.substring(0, 100) + '...',
                    url: location.href
                })
            }
        }

        if (launch.tbdtime != 1) {
            if (launch.status.id != 3 && launch.status.id != 4 && launch.status.id != 7) {
                $buttons.innerHTML += `<a class="waves-effect waves-light btn hoverable" href="/#countdown=${launch.launch_library_id || launch.slug}">Countdown only</a>`
            }
        }

        if(launch.mission && launch.mission.description) {
            $description.innerHTML = launch.mission.description;
            if(launch.mission.description.length > 200) {
                $buttons.innerHTML += `<a class="waves-effect waves-light btn hoverable" onclick="(description.style.display = ((description.style.display == \'none\' )? \'unset\' : \'none\'))">Toggle Description</a>`;
            }
        }   
        const agency_sources = sources.handles[launch.launch_service_provider.abbrev.toLowerCase()];
        if (agency_sources && agency_sources.reddit) {
            $buttons.innerHTML += `<a class="waves-effect waves-light btn hoverable" href="https://www.reddit.com/r/${agency_sources.reddit}" target="_blank">/r/${agency_sources.reddit} Subreddit</a>`;
        }

        if (launch.status.id == 1 || launch.status.id == 6) {
            let count = setInterval(function () {
                document.title = `[${Countdown(launch.net)}] ${launch.name.split("|")[1]}`;
                $countdown.innerHTML = Countdown(launch.net)
            }, 1000);
            countdowns.push(count);

            let updatecount = setInterval(function () {
                updateCountdown(launch);
            }, 60000);
            countdowns.push(updatecount);
        }

        

        if (navigator.onLine) {

            if (launch.vidURLs.length) {
                let videolist = "<option disabled selected>Select source</option>";
                let first_video = false;
                for (let i in launch.vidURLs) {
                    if (!new RegExp(sources.embed_blacklist.join("|")).test(launch.vidURLs[i].url)) {
                        if (!first_video) first_video = i;
                        videolist += `<option value='${i}'>${launch.vidURLs[i].title.slice(0, 100)}</option>`;
                    }
                }

                window.selectSource = function (source) {
                    id = parseInt(document.getElementById(source + "_select").value);
                    window.open(embedify(launch.vidURLs[id].url), source);
                    document.getElementById(source + "_reload").href = embedify(launch.vidURLs[id].url);
                    document.getElementById(source + "_share").href = launch.vidURLs[id].url
                    document.getElementById(source).innerHTML = `<iframe name="${source}" src="${embedify(launch.vidURLs[id].url)}"  allow="autoplay; fullscreen"></iframe>`
                };

                $feature.innerHTML =
                    `<div class="video-container" id="feature_frame">
                        <iframe name="feature_frame" src="${embedify(launch.vidURLs[first_video].url)}"  allow="autoplay; fullscreen"></iframe>
                    </div>
                    <div class="cardnav">
                        <a id="feature_frame_reload" href="${embedify(launch.vidURLs[first_video].url)}" target="feature_frame">
                            <i class="fas fa-sync-alt"></i>
                        </a>
                        <a id="feature_frame_share" href="${launch.vidURLs[first_video].url}" target="_blank">
                            <i class="fas fa-external-link-square-alt"></i>
                        </a>
                        ${(launch.vidURLs.length > 1) ? ('<select id="feature_frame_select" onchange="selectSource(\'feature_frame\')">' + videolist + '</select>') : ''}
                    </div>`;
            } else if(launch.pad.latitude && launch.pad.longitude) {
                $feature.innerHTML += `
                <div class="video-container" id="feature_frame">
                    <iframe src="https://www.google.com/maps/embed/v1/place?key=AIzaSyDVnn_hI36-gqNndDceDStv2iLMRFvYTzE&maptype=satellite&q=${launch.pad.latitude},${launch.pad.longitude}"  allow="autoplay; fullscreen"></iframe>
                </div>`;
            }

            document.getElementById("maintabs").innerHTML += '<li class="tab"><a href="#information">Info</a></li>';

            let $information = document.createElement("div");
            $information.id = "information";
            $main.appendChild($information);

            materialize()

            if (launch.mission && launch.mission.wiki_url) {
                $information.innerHTML += `<div class="container"><div class="card"><div class="video-container"><iframe src="${embedify(launch.mission.wiki_url)}"  allow="autoplay; fullscreen"></iframe></div></div>`;
            }
            if (launch.rocket.wiki_url) {
                $information.innerHTML += `<div class="container"><div class="card"><div class="video-container"><iframe src="${embedify(launch.rocket.wiki_url)}" allow="autoplay; fullscreen"></iframe></div></div>`
            }
            if (launch.vidURLs.length) {
                $information.innerHTML += `<div class="container"><div class="card"><div class="video-container"><iframe src="https://www.google.com/maps/embed/v1/place?key=AIzaSyDVnn_hI36-gqNndDceDStv2iLMRFvYTzE&maptype=satellite&q=${launch.pad.latitude},${launch.pad.longitude}"  allow="autoplay; fullscreen"></iframe></div></div>`;
            }
            if (launch.pad.wiki_url) {
                $information.innerHTML += `<div class="container"><div class="card"><div class="video-container"><iframe src="${embedify(launch.pad.wiki_url)}"  allow="autoplay; fullscreen"></iframe></div></div>`;
            }
            if (launch.launch_service_provider.wiki_url) {
                $information.innerHTML += `<div class="container"><div class="card"><div class="video-container"><iframe src="${embedify(launch.launch_service_provider.wiki_url)}"  allow="autoplay; fullscreen"></iframe></div></div>`;
            }
            /*

            let list = launch.media.video.concat(launch.media.info).concat(launch.media.comments).concat(launch.media.last);
            let video = launch.media.video;
            let media = launch.media.info.concat(launch.media.comments).concat(launch.media.last);

            let medialist = "<option disabled selected>Select source</option>";
            for (let item in list) {
                medialist += `<option value='${item}'>${list[item].name.slice(0, 100)}</option>`;
            }

            window.selectSource = function (source) {
                id = parseInt(document.getElementById(source + "_select").value);
                window.open(list[id].embed, source);
                document.getElementById(source + "_reload").href = list[id].embed;
                document.getElementById(source + "_share").href = list[id].share
                document.getElementById(source).innerHTML = `<iframe name="${source}" src="${list[id].embed}"  allow="autoplay; fullscreen"></iframe>`
            };

            if (video.length) {
                $feature.innerHTML = `<div class="video-container" id="feature_frame"><iframe name="feature_frame" src="${((video[0].embed.match("\\?")) ? (video[0].embed + "&autoplay=1&enablejsapi=1") : (video[0].embed + "?autoplay=1&enablejsapi=1"))}"  allow="autoplay; fullscreen"></iframe></div><div class="cardnav"><a id="feature_frame_reload" href="${video[0].embed}" target="feature_frame"><i class="fas fa-sync-alt"></i></a><a id="feature_frame_share" href="${video[0].share}" target="_blank"><i class="fas fa-external-link-square-alt"></i></a>${((launch.media.video.length > 1) ? ('<select id="feature_frame_select" onchange="selectSource(\'feature_frame\')">' + medialist + '</select>') : '')}</div></div></div>${$feature.innerHTML}`;
            }

            if (media.length) {

                $live.innerHTML += `<div class="container"><div class="card"><div class="video-container" id="contentframe1"><iframe name="contentframe1" src="${media[0].embed}"  allow="autoplay; fullscreen"></iframe></div><div class="cardnav"><a id="contentframe1_reload" href="${media[0].embed}" target="contentframe1"><i class="fas fa-sync-alt"></i></a><a id="contentframe1_share" href="${media[0].share}" target="_blank"><i class="fas fa-external-link-square-alt"></i></a><select id="contentframe1_select" onchange="selectSource(\'contentframe1\')">${medialist}</select></div></div></div></div>`;

                if (media.length > 1 && launch.status.id != 3 && launch.status.id != 4 && launch.status.id != 7) {
                    $live.innerHTML += `<div class="container"><div class="card"><div class="video-container" id="contentframe2"><iframe name="contentframe2" src="${media[media.length - 1].embed}"  allow="autoplay; fullscreen"></iframe></div><div class="cardnav"><a id="contentframe2_reload" href="${media[media.length - 1].embed}" target="contentframe2"><i class="fas fa-sync-alt"></i></a><a id="contentframe2_share" href="${media[media.length - 1].share}" target="_blank"><i class="fas fa-external-link-square-alt"></i></a><select id="contentframe2_select" onchange="selectSource(\'contentframe2\')">${medialist}</select></div></div></div></div>`;
                }
            }

            if (launch.media.twitter.length || launch.agency.social.twitter) {
                let twitter = document.createElement("div");
                $live.appendChild(twitter);

                twitter.className = "container";
            
                if (launch.status.id != 3 && launch.status.id != 4 && launch.status.id != 7 && launch.agency.social.twitter && launch.media.twitter.length < 2) {
                    launch.media.twitter.push({ url: `https://twitter.com/${launch.agency.social.twitter}` })
                }
                for (let tweet of launch.media.twitter) {
                    twitter.innerHTML += `<div class="col s12 m${Math.floor(12 / launch.media.twitter.length)}"><div class="card"><div class="video-container"><a class="twitter-timeline" data-dnt="true" href="${tweet.url}" ${($settings.dark ? " data-theme=\"dark\"" : "")}></a></div></div></div>`;
                }
                if (typeof twttr != undefined) {
                    twttr.widgets.load();
                }
            }

            */

        } else {
            $main.className = "valign-wrapper";
            $main.innerHTML += '<div class="container"><h1 class="white-text">You\'re offline :(</h1></div>'
        }

    })
}

