import {QueryString, materialize, load, ReadableDateString} from '../js/utils'
const sources = require('../sources.json');

export default function search(c) {
    let $main = document.getElementsByTagName("main")[0];
    let $info = document.getElementById("info");
    let $query = QueryString();
    if (c != "undefined") {

        for (let i in sources.info.search) {
            if (c.toLowerCase().match(i) && !document.getElementById("maintabs")) {
                let data = sources.info.search[i]
                $info.innerHTML = '<div class="card-content"><img class="circle" src="' + data.img + '" onerror=this.onerror=null;this.src=""><h1 class="header black-text truncate">' + data.name + '</h1><div id="chips"><a class="chip" href="javascript:window.history.back();"><i class="fas fa-arrow-alt-circle-left"></i>Go Back</a></div></br><a class="flow-text">' + (data.desc || "") + '</a></div><div class="card-tabs"><ul id="maintabs" class="tabs tabs-fixed-width"></ul></div>';
                for (let badge of data.badges) {
                    document.getElementById("chips").innerHTML += '<a class="chip tooltipped" data-tooltip="' + (badge.tip || "") + '" href="' + (badge.url || "") + '"><img src="' + (badge.img || "") + '">' + (badge.name || "") + "</a>"
                }
                break
            }
        }

        if (!document.getElementById("maintabs"))
            $info.innerHTML = '<div class="card-content"><h1 class="header black-text truncate">Results for "' + c + '"</h1><div id="chips"><a class="chip" href="javascript:window.history.back();"><i class="fas fa-arrow-alt-circle-left"></i>Go Back</a></div></div><div class="card-tabs"><ul id="maintabs" class="tabs tabs-fixed-width"></ul></div>'


        load("launch?limit=200&mode=summary&sort=desc&name=" + c + "&format=stats" + (($query.type == "failures") ? "&status=4" : ""), function (a) {
            let loading = document.getElementById("loading")
            if (loading) {
                loading.parentNode.removeChild(loading)
            }

            if (a.launches.length) {
                $main.innerHTML += '<div id="results"><div id="next"></div><div id="switch" style="display:none" class="card-tabs"><ul class="tabs"><li class="tab"><a href="#past">Launched</a></li><li class="tab"><a href="#future">Upcoming</a></li></ul></div><div id="past"></div><div id="future"></div></div>';
                let $future = document.getElementById("future");
                let $past = document.getElementById("past");
                const $today = new Date();

                if (a.launches.length == 1) {
                    document.getElementById("maintabs").innerHTML = '<li class="tab"><a href="#results" class="active">Launches</a></li>' + document.getElementById("maintabs").innerHTML;
                    let b = a.launches[0];
                    document.getElementById("next").innerHTML = '<div class="col s12"><div class="card"><div class="card-stacked"><div class="card-content"><h3 class="header black-text"><a style="color:black" class="tooltipped" data-tooltip="More info" href="/#rocket=' + b.name.split(" | ")[0].split("/")[0] + '">' + b.name.replace(" | ", "</a></h3><h2>") + '</h2><a class="chip tooltipped" data-tooltip="' + b.net + '"><i class="far fa-clock"></i>' + ReadableDateString(b.net) + '</a><h4 id="countdown' + b.id + '">' + b.status + '</h4></div><div class="card-action"><a class="waves-effect waves-light btn hoverable" href="/#id=' + b.id + '">Details</a></div></div></div>';
                } else {
                    document.getElementById("maintabs").innerHTML = '<li class="tab"><a href="#stats">Stats</a></li>' + document.getElementById("maintabs").innerHTML;
                    document.getElementById("maintabs").innerHTML = '<li class="tab"><a href="#results" class="active">Launches</a></li>' + document.getElementById("maintabs").innerHTML;

                    for (let g in a.launches) {
                        let b = a.launches[g];
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

                    let labels = [];
                    let togo = [];
                    let success = [];
                    let fail = [];
                    for (let k in a.stats.byYear) {
                        if (k <= new Date().getUTCFullYear()) {
                            labels.push(parseInt(k));
                            togo.push(a.stats.byYear[k][1] + a.stats.byYear[k][2]);
                            success.push(a.stats.byYear[k][3]);
                            fail.push(a.stats.byYear[k][4]);
                        }
                    }

                    let rocketlist = "";
                    for (let i in a.rockets) {
                        rocketlist += '<li class="collection-item"><a href="/#rocket=' + a.rockets[i] + '">' + a.rockets[i] + '</a></li>'
                    }

                    let $stats = document.createElement("div");
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
                                        let dataset = data.datasets[tooltipItem.datasetIndex];
                                        let count = parseFloat(dataset.data[tooltipItem.index]);
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

    } else {
        $info.innerHTML = '<div class="card-content"><h1 class="header black-text truncate">What are you looking for?</h1></div>';
        $main.innerHTML = '<div class="row"><div class="col s12"><div class="card"><div class="card-content"><div class="input-field"><input type="text" name="search"></div></div><div class="card-action"><a onclick="(location.hash = \'search=\' + document.getElementsByTagName(\'input\')[0].value)" class="waves-effect waves-light btn hoverable">Submit</a></div></div></div>';
    }
}