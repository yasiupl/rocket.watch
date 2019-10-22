import {QueryString, load, materialize, ISODateString, ReadableDateString} from '../js/utils'


export default function watch(j, k) {
    k = k || "live"

    let $main = document.getElementsByTagName("main")[0];
    let $info = document.getElementById("info");
    let $live = document.createElement("div");
    let $query = QueryString();

    $live.id = "live";
    $main.className = ""
    $main.innerHTML = "";
    $main.appendChild($live);

    load((k.match("custom")) ? (j + "?format=customlive") : ("launch?mode=verbose" + (parseInt(j) ? ("&id=" + j) : ("&limit=1&name=" + j)) + "&format=" + (($query.mode == "countdown") ? "" : k)), function (e) {

        let a = e.launches[0];

        let changed = a.changed;

        let updateCountdown = function () {
            load("launch?mode=summary" + (parseInt(j) ? ("&id=" + j) : ("&limit=1&name=" + j)) + "&changed=" + ISODateString(Date.parse(changed) + 1000).replace("T", " ").split(".")[0], function (refreshdata) {

                if (refreshdata.status != "error") {
                    let b = refreshdata.launches[0];

                    if (b) {
                        console.log("Updating Countdown");

                        for (let d in countdowns) {
                            window.clearInterval(countdowns[d]);
                        }

                        countdown.innerHTML = b.status;

                        changed = b.changed

                        if (b.statuscode == 1 || b.statuscode == 6) {
                            M.toast({
                                html: "Updated Countdown"
                            });
                            let count = setInterval(function () {
                                let o = Math.floor((Date.parse(b.net) - Date.parse(new Date())) / 1000);
                                document.title = "[" + Countdown(b.net) + "] " + b.name.split("|")[1];
                                countdown.innerHTML = Countdown(b.net)
                            }, 1000);
                            countdowns.push(count);
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


        $info.innerHTML = '<div id="video"></div><div id="details" class="card-content"><h1><a class="tooltipped" data-tooltip="More info" href="/#rocket=' + a.rocket.id + '">' + a.name.replace("|", "</a> | ") + '</h1><h3 id="countdown' + a.id + '">' + a.status + '</h3><div id="chips"><a class="chip" href="javascript:window.history.back();"><i class="fas fa-arrow-alt-circle-left"></i>Go Back</a><a class="chip" id="refreshLaunch"><i class="fas fa-sync"></i>Refresh</a><a class="chip tooltipped" data-tooltip="More info" href="/#agency=' + a.agency.id + '"><img src="' + a.agency.icon + '?size=32" onerror=this.onerror=null;this.src="' + a.agency.countryFlag + '">' + a.agency.name + '</a><a class="chip tooltipped" data-tooltip="More info" href="/#pad=' + (a.location.pads && a.location.pads[0].id) + '"><i class="far fa-compass"></i>' + a.location.pads[0].name + '</a><a class="chip tooltipped" id="launchdate" data-tooltip="' + a.net + '"><i class="far fa-clock"></i>' + ReadableDateString(a.net) + '</a></div><p class="flow-text" id="description">' + a.description + '</p></div><div id="buttons"></div><div class="card-tabs"><ul id="maintabs" class="tabs tabs-fixed-width"></ul></div></div>';

        let livevideo = document.querySelector("#video");
        let details = document.querySelector("#details");
        let buttons = document.querySelector("#buttons");
        let countdown = document.querySelector("#countdown" + a.id);
        let description = document.querySelector("#description");
        let badges = document.querySelector("#chips");
        let tabs = document.querySelector("#maintabs");


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

        document.getElementById("refreshLaunch").onclick = function () {

            for (let d in countdowns) {
                window.clearInterval(countdowns[d]);
            }
            watch(j, k);
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
            let count = setInterval(function () {
                let o = Math.floor((Date.parse(a.net) - Date.parse(new Date())) / 1000);
                document.title = "[" + Countdown(a.net) + "] " + a.name.split("|")[1];
                countdown.innerHTML = Countdown(a.net)
            }, 1000);
            countdowns.push(count);


            let updatecount = setInterval(function () {
                updateCountdown();
            }, 60000);
            countdowns.push(updatecount);

        }

        if ($query.mode == "countdown") {
            countdown.style = "font-size: 10rem;";
            return
        }

        for (let b in a.media.badge) {
            let d = a.media.badge[b];
            badges.innerHTML += '<a class="chip ' + (d.desc ? 'tooltipped" data-tooltip="' + d.desc + '"' : '"') + ' ' + (d.url ? 'href="' + d.url + '"' : '') + '>' + (d.img ? '<img src="' + d.img + '">' : '') + (d.name || '') + "</a>"
        }

        for (let b in a.media.button) {
            let d = a.media.button[b];
            buttons.innerHTML += '<a class="waves-effect waves-light btn hoverable" href="' + d.url + '" target="_blank">' + d.name + '</a>';
        }

        if (navigator.onLine) {

            let list = a.media.video.concat(a.media.info).concat(a.media.comments).concat(a.media.last);
            let video = a.media.video;
            let media = a.media.info.concat(a.media.comments).concat(a.media.last);

            if (media.length) {
                document.getElementById("maintabs").innerHTML += '<li class="tab"><a href="#live" class="active">Live</a></li><li class="tab"><a href="#information">Info</a></li>';
            } else {
                document.getElementById("maintabs").innerHTML += '<li class="tab"><a href="#information">Info</a></li>';
            }
            let $information = document.createElement("div");
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

            let medialist = "<option disabled selected>Select source</option>";
            for (let e in list) {
                medialist += "<option value='" + e + "'>" + list[e].name.slice(0, 100) + "</option>";
            }

            let selectSource = function (o) {
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
                let c = document.createElement("div");
                c.className = "container row";
                c.style = "padding: 0 !important";
                for (let b in a.media.audio) {
                    c.innerHTML += '<div class="col s12 m' + Math.floor(12 / a.media.audio.length) + '"><div class="card-panel"><audio style="width:100%" controls preload="none"><source src="' + a.media.audio[b].embed + '"></audio></br><div class="cardnav"><a class="truncate">' + a.media.audio[b].name + "</a></div></div></div>"
                }
                $live.appendChild(c)
            }

            if (a.media.twitter.length) {
                let y = document.createElement("div");
                $live.appendChild(y);

                if (!($query.mode == "tv" && media.length >= 2)) {
                    y.className = "container";
                }
                for (let b in a.media.twitter) {
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

