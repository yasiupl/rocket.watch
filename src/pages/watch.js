import { QueryString, load, materialize, embedify, ReadableDateString, Countdown, getLongStatusName } from '../js/utils'
const sources = require('../sources.json');

export default async function watch(id) {

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
        if (!data.detail) {
            let launch = data.results[0] || data;

            const launchDate = Date.parse(launch.net);

            document.title = launch.name;

            $info.innerHTML = `<div id="feature"></div>
							<div id="details" class="card-content">
								<h1><a class="tooltipped" data-tooltip="More info" href="/#rocket=${launch.rocket.configuration.id}">${launch.name.replace("|", "</a> | ")}</h1>
								<h3 id="countdown-${launch.id}">${getLongStatusName(launch.status.id)}</h3>
                                <div id="chips">
                                    <a class="chip" href="javascript:window.history.back();"><i class="fas fa-arrow-alt-circle-left"></i>Go Back</a>
                                    <a class="chip" onclick="location.reload(true);"><i class="fas fa-sync"></i>Refresh</a>
                                    <a class="chip tooltipped" data-tooltip="More info" href="/#agency=${launch.launch_service_provider.id}"><img src="${launch.launch_service_provider.logo_url}">${launch.launch_service_provider.name}</a>
									<a class="chip tooltipped" data-tooltip="More info" href="/#pad=${launch.pad.id}"><i class="far fa-compass"></i>${launch.pad.name}</a>
									<a class="chip tooltipped" id="launchdate" data-tooltip="${launch.net}"><i class="far fa-clock"></i>${ReadableDateString(launch.net)}</a>
                                </div>
                                <p class="flow-text">${launch.mission && launch.mission.description.split(". ")[0]}</p>
							</div>
							<div id="buttons"></div>
							<div class="card-tabs">
								<ul id="maintabs" class="tabs tabs-fixed-width"></ul>
							</div>`;

            let $feature = document.querySelector("#feature");
            let $buttons = document.querySelector("#buttons");
            let $countdown = document.querySelector("#countdown-" + launch.id);
            let $badges = document.querySelector("#chips");

            if (launch.probability != null && [3, 4, 7].indexOf(launch.status.id) == -1) {
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

            if (navigator.onLine) {
                // REDDIT
                let resources_promises = [];

                window.reddit_posts = [];

                window.selectReddit = function (source) {
					let id = document.getElementById(source + "_select").value;
					let post = window.reddit_posts.find(post => post.id == id);
                    document.getElementById(source + "_reload").href = post.embed;
                    document.getElementById(source + "_share").href = post.url;
                    document.getElementById(source).innerHTML = `<iframe name="${source}" src="${post.embed}"  allow="autoplay; fullscreen"></iframe>`
                };

                const agency_sources = sources.handles[launch.launch_service_provider.abbrev.toLowerCase()];
                if (agency_sources && agency_sources.reddit) {
                    $buttons.innerHTML += `<a class="waves-effect waves-light btn hoverable" href="https://www.reddit.com/r/${agency_sources.reddit}" target="_blank">/r/${agency_sources.reddit} Subreddit</a>`;

                    if ((new Date(launch.net) > new Date("2009-01-01"))) {
                        let load_reddit_promise = fetch(`https://www.reddit.com/r/${agency_sources.reddit}/search.json?sort=relevance&restrict_sr=on&q=${encodeURIComponent(launch.name.split("| ")[1].replace("SpX ", ""))}`)
                            .then(response => response.json())
                            .then(reddit => {
                                for (let post of reddit.data.children) {
                                    if (post.data.created_utc * 1000 < Date.parse(launch.window_end)) {
                                        window.reddit_posts.push({
											priority: 10,
											id: post.data.permalink.split("/comments/")[1].split("/")[0],
                                            title: post.data.title,
                                            url: `https://reddit.com${post.data.permalink}`,
                                            embed: embedify(`https://reddit.com${post.data.permalink}`),
                                        });
                                    }
                                }
                            });
                        resources_promises.push(load_reddit_promise);
                    }
                }

                // r/SpaceX API
                if (launch.launch_service_provider.abbrev == "SpX") {
                    let r_spacex_api_promise = fetch(`https://api.spacexdata.com/v3/launches${(launchDate > Date.now()) ? `/upcoming` : ``}?start=${(new Date(launchDate - (12 * 60 * 60 * 1000))).toISOString()}&final=${(new Date(launchDate + (12 * 60 * 60 * 1000))).toISOString()}`)
                        .then(response => response.json())
                        .then(body => {
                            let data = body[0];
                            if (data) {
                                const reddit_frame_select = document.getElementById("reddit_frame_select");
                                if (data.rocket.first_stage.cores && data.rocket.first_stage.cores[0].reused) {
                                    $badges.innerHTML += `<a class="chip tooltipped"><img src="/res/reuse.png">Reused booster</a>`
                                }
                                if (data.rocket.second_stage.payloads && data.rocket.second_stage.payloads[0].reused) {
                                    $badges.innerHTML += `<a class="chip tooltipped"><img src="/res/reuse.png">Reused capsule</a>`
								}
								if (data.links && data.links.reddit_launch) {
                                    window.reddit_posts.push({
										priority: 1,
                                        id: data.links.reddit_launch.split("/comments/")[1].split("/")[0],
                                        title: "r/SpaceX Launch Thread",
                                        url: data.links.reddit_launch,
                                        embed: embedify(data.links.reddit_launch)
                                    });
                                }
                                if (data.links && data.links.reddit_campaign) {
                                    window.reddit_posts.push({
										priority: 1,
										id: data.links.reddit_campaign.split("/comments/")[1].split("/")[0],
                                        title: "r/SpaceX Campaign Thread",
                                        url: data.links.reddit_campaign,
                                        embed: embedify(data.links.reddit_campaign)
                                    });
                                }
                            }
                        });
                    resources_promises.push(r_spacex_api_promise);
				}
				
				// Display posts after all requests are complete
                Promise.all(resources_promises).then(() => {
                    if (window.reddit_posts.length) {
                        window.reddit_posts.sort((a,b) => (a.priority > b.priority) ? 1 : ((b.priority > a.priority) ? -1 : 0));
                        
                        let reddit_list = window.reddit_posts.reduce((acc, post) => { return acc += `<option value='${post.id}'>${post.title}</option>`},"<option disabled selected>Select post</option>");
                        
                        document.getElementById("maintabs").innerHTML += '<li class="tab"><a href="#live" class="active">Live</a></li>';
                        
                        $live.innerHTML =
                        `<div class="container">
                            <div class="card">
                                <div class="video-container" id="reddit_frame">
                                    <iframe name="reddit_frame" src="${window.reddit_posts[0].embed}"  allow="autoplay; fullscreen"></iframe>
                                </div>
                                <div class="cardnav">
                                    <a id="reddit_frame_reload" href="${window.reddit_posts[0]}" target="reddit_frame">
                                        <i class="fas fa-sync-alt"></i>
                                    </a>
                                    <a id="reddit_frame_share" href="${window.reddit_posts[0]}" target="_blank">
                                        <i class="fas fa-external-link-square-alt"></i>
                                    </a>
                                    ${(window.reddit_posts.length > 1) ? (`<select id="reddit_frame_select" onchange="selectReddit(\'reddit_frame\')">${reddit_list}}</select>`) : ``}
                                </div>
                            </div>
                        </div>`;
                    }
                    materialize();
                });

                if (launch.status.id == 1 || launch.status.id == 6) {
                    let count = setInterval(function () {
                        document.title = `[${Countdown(launch.net)}] ${launch.name.split("|")[1]}`;
                        $countdown.innerHTML = Countdown(launch.net)
                    }, 1000);
                    countdowns.push(count);
                }

                // VIDEO
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
                } else if (launch.pad.latitude && launch.pad.longitude) {
                    $feature.innerHTML += `
                <div class="video-container" id="feature_frame">
                    <iframe src="https://www.google.com/maps/embed/v1/place?key=AIzaSyDVnn_hI36-gqNndDceDStv2iLMRFvYTzE&maptype=satellite&q=${launch.pad.latitude},${launch.pad.longitude}"  allow="autoplay; fullscreen"></iframe>
                </div>`;
                }

                // INFO CARD

                document.getElementById("maintabs").innerHTML += '<li class="tab"><a href="#information">Info</a></li>';

                let $information = document.createElement("div");
                $information.id = "information";
                $main.appendChild($information);

                if (launch.mission && launch.mission.description.split(". ")) {                
                    $information.innerHTML = 
                        `<div class="container">
                            <div class="card-panel">
                                <p class="flow-text" id="description">
                                    ${launch.mission && launch.mission.description || ""}
                                </p>
                            </div>
                        </div>`;
                }

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
        } else {
            $info.innerHTML = `<h1 class="white-text" onclick="location.reload(true)">${data.detail || "Error"}</h1>`;
        }
    })
}
