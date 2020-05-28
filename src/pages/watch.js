import { QueryString, load, materialize, ISODateString, ReadableDateString, Countdown } from '../js/utils'


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
    load((mode.match("custom")) ? (id + "?format=customlive") : ("launch?mode=verbose" + (parseInt(id) ? ("&id=" + id) : ("&limit=1&name=" + id)) + "&format=" + mode), function (data) {

        let launch = data.launches[0];

        document.title = launch.name;

		$info.innerHTML = `<div id="video"></div>
							<div id="details" class="card-content">
								<h1><a class="tooltipped" data-tooltip="More info" href="/#rocket=${launch.rocket.id}">${launch.name.replace("|", "</a> | ")}</h1>
								<h3 id="countdown${launch.id}">${launch.status}</h3>
								<div id="chips">
									<a class="chip" href="javascript:window.history.back();"><i class="fas fa-arrow-alt-circle-left"></i>Go Back</a>
									<a class="chip tooltipped" data-tooltip="More info" href="/#pad=${launch.location.pads && launch.location.pads[0].id}"><i class="far fa-compass"></i>${launch.location.pads[0].name}</a>
									<a class="chip tooltipped" id="launchdate" data-tooltip="${launch.net}"><i class="far fa-clock"></i>${ReadableDateString(launch.net)}</a>
								</div>
								<p class="flow-text" id="description">${launch.description}</p>
							</div>
							<div id="buttons">
								<a class="waves-effect waves-light btn hoverable blurple" href="https://rocket.watch/discord" target="_blank"><i class="fab fa-discord"></i> Discord</a>
								<a class="waves-effect waves-light btn hoverable" onclick="(description.style.display = ((description.style.display == \'none\' )? \'unset\' : \'none\'))">Toggle Description</a>
							</div>
							<div class="card-tabs">
								<ul id="maintabs" class="tabs tabs-fixed-width"></ul>
							</div>`;

        let livevideo = document.querySelector("#video");
        let buttons = document.querySelector("#buttons");
        let countdown = document.querySelector("#countdown" + launch.id);
		let badges = document.querySelector("#chips");
		let description = document.querySelector("#description");

        if (launch.probability != "-1" && [3, 4, 7].indexOf(launch.statuscode) == -1) {
            badges.innerHTML += `<a class="chip tooltipped" data-tooltip="Launch probability %">${launch.probability}% probability</a>`
        };

        if (navigator.share) {
            buttons.innerHTML += '<a class="waves-effect waves-light btn hoverable" onclick="window.share()"><i class="fas fa-share-alt"></i></a>';
            window.share = function () {
                navigator.share({
                    title: launch.name,
                    text: launch.description.substring(0, 100) + '...',
                    url: location.href
                })
            }
        }

        if (launch.tbdtime != 1) {
            if (launch.statuscode != 3 && launch.statuscode != 4 && launch.statuscode != 7) {
                buttons.innerHTML += `<a class="waves-effect waves-light btn hoverable" href="/#countdown=${launch.id}">Countdown only</a>`
            }

            if (launch.statuscode != 3 && launch.statuscode != 4 && launch.statuscode != 7 && (launch.media.video || launch.media.comments) && window.innerWidth >= 800) {
                buttons.innerHTML += `<a class="waves-effect waves-light btn hoverable tooltipped" href="/#live=${launch.id}" data-tooltip="Display more data on one screen">TV mode</a>`
            }
        }

        if (launch.agency.social.reddit) {
            buttons.innerHTML += `<a class="waves-effect waves-light btn hoverable" href="https://www.reddit.com/r/${launch.agency.social.reddit}" target="_blank">/r/${launch.agency.social.reddit} Subreddit</a>`;
        }

        if (launch.statuscode == 1 || launch.statuscode == 6) {
            let count = setInterval(function () {
                document.title = `[${Countdown(launch.net)}] ${launch.name.split("|")[1]}`;
                countdown.innerHTML = Countdown(launch.net)
            }, 1000);
            countdowns.push(count);

            let updatecount = setInterval(function () {
                updateCountdown(launch);
            }, 60000);
            countdowns.push(updatecount);
        }

        for (let badge of launch.media.badge) {
            badges.innerHTML += `<a class="chip ${(badge.desc ? 'tooltipped" data-tooltip="' + badge.desc + '"' : '"')} ${(badge.url ? 'href="${d.url}"' : '')}>${(badge.img ? '<img src="${d.img}">' : '') + (badge.name || '')}</a>`
        }

        if (navigator.onLine) {

            let list = launch.media.video.concat(launch.media.info).concat(launch.media.comments).concat(launch.media.last);
            let video = launch.media.video;
            let media = launch.media.info.concat(launch.media.comments).concat(launch.media.last);

            if (media.length || launch.media.twitter.length) {
                document.getElementById("maintabs").innerHTML += '<li class="tab"><a href="#live" class="active">Live</a></li><li class="tab"><a href="#information">Info</a></li>';
            } else {
                document.getElementById("maintabs").innerHTML += '<li class="tab"><a href="#information">Info</a></li>';
            }

            let $information = document.createElement("div");
            $information.id = "information";
            $main.appendChild($information);

            materialize()

            if (launch.missions[0] && launch.missions[0].wikiURL) {
                $information.innerHTML += `<div class="container"><div class="card"><div class="video-container"><iframe src="${launch.missions[0].wikiURL.replace("http://", "https://")}"  allow="autoplay; fullscreen"></iframe></div></div>`;
            }
            if (launch.rocket.wiki) {
                $information.innerHTML += `<div class="container"><div class="card"><div class="video-container"><iframe src="${launch.rocket.wiki}" allow="autoplay; fullscreen"></iframe></div></div>`
            }
            $information.innerHTML += `<div class="container"><div class="card"><div class="video-container"><iframe src="${launch.location.map}"  allow="autoplay; fullscreen"></iframe></div></div>`;
            if (launch.location.wikiURL || launch.location.pads[0].wikiURL) {
                $information.innerHTML += `<div class="container"><div class="card"><div class="video-container"><iframe src="${(launch.location.wikiURL || launch.location.pads[0].wikiURL).replace("http://", "https://")}"  allow="autoplay; fullscreen"></iframe></div></div>`;
            }
            if (launch.agency.wiki) {
                $information.innerHTML += `<div class="container"><div class="card"><div class="video-container"><iframe src="${launch.agency.wiki}"  allow="autoplay; fullscreen"></iframe></div></div>`;
            }

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
                livevideo.innerHTML = `<div class="video-container" id="videoframe1"><iframe name="videoframe1" src="${((video[0].embed.match("\\?")) ? (video[0].embed + "&autoplay=1&enablejsapi=1") : (video[0].embed + "?autoplay=1&enablejsapi=1"))}"  allow="autoplay; fullscreen"></iframe></div><div class="cardnav"><a id="videoframe1_reload" href="${video[0].embed}" target="videoframe1"><i class="fas fa-sync-alt"></i></a><a id="videoframe1_share" href="${video[0].share}" target="_blank"><i class="fas fa-external-link-square-alt"></i></a>${((launch.media.video.length > 1) ? ('<select id="videoframe1_select" onchange="selectSource(\'videoframe1\')">' + medialist + '</select>') : '')}</div></div></div>${livevideo.innerHTML}`;
            }

            if (media.length) {

                $live.innerHTML += `<div class="container"><div class="card"><div class="video-container" id="contentframe1"><iframe name="contentframe1" src="${media[0].embed}"  allow="autoplay; fullscreen"></iframe></div><div class="cardnav"><a id="contentframe1_reload" href="${media[0].embed}" target="contentframe1"><i class="fas fa-sync-alt"></i></a><a id="contentframe1_share" href="${media[0].share}" target="_blank"><i class="fas fa-external-link-square-alt"></i></a><select id="contentframe1_select" onchange="selectSource(\'contentframe1\')">${medialist}</select></div></div></div></div>`;

                if (media.length > 1 && launch.statuscode != 3 && launch.statuscode != 4 && launch.statuscode != 7) {
                    $live.innerHTML += `<div class="container"><div class="card"><div class="video-container" id="contentframe2"><iframe name="contentframe2" src="${media[media.length - 1].embed}"  allow="autoplay; fullscreen"></iframe></div><div class="cardnav"><a id="contentframe2_reload" href="${media[media.length - 1].embed}" target="contentframe2"><i class="fas fa-sync-alt"></i></a><a id="contentframe2_share" href="${media[media.length - 1].share}" target="_blank"><i class="fas fa-external-link-square-alt"></i></a><select id="contentframe2_select" onchange="selectSource(\'contentframe2\')">${medialist}</select></div></div></div></div>`;
                }
            }

            if (launch.media.audio.length) {
                let audio = document.createElement("div");
                audio.className = "container row";
                audio.style = "padding: 0 !important";
                for (let track of launch.media.audio) {
                    audio.innerHTML += `<div class="col s12 m${Math.floor(12 / launch.media.audio.length)}"><div class="card-panel"><audio style="width:100%" controls preload="none"><source src="${track.embed}"></audio></br><div class="cardnav"><a class="truncate">${track.name}</a></div></div></div>`
                }
                $live.appendChild(audio)
            }

            if (launch.media.twitter.length || launch.agency.social.twitter) {
                let twitter = document.createElement("div");
                $live.appendChild(twitter);

                twitter.className = "container";
            
                if (launch.statuscode != 3 && launch.statuscode != 4 && launch.statuscode != 7 && launch.agency.social.twitter && launch.media.twitter.length < 2) {
                    launch.media.twitter.push({ url: `https://twitter.com/${launch.agency.social.twitter}` })
                }
                for (let tweet of launch.media.twitter) {
                    twitter.innerHTML += `<div class="col s12 m${Math.floor(12 / launch.media.twitter.length)}"><div class="card"><div class="video-container"><a class="twitter-timeline" data-dnt="true" href="${tweet.url}" ${($settings.dark ? " data-theme=\"dark\"" : "")}></a></div></div></div>`;
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

