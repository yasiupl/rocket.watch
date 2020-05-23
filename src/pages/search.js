import {QueryString, materialize, load, ReadableDateString, Countdown} from '../js/utils'
import Chart from 'chart.js';
const sources = require('../sources.json');

export default function search(c) {
    let $main = document.getElementsByTagName("main")[0];
    let $info = document.getElementById("info");
    let $query = QueryString();
    if (c != "undefined") {

        for (let i in sources.info.search) {
            if (c.toLowerCase().match(i) && !document.getElementById("maintabs")) {
                let data = sources.info.search[i]
                $info.innerHTML = '<div class="card-content"><img class="circle" src="' + data.img + '" onerror=this.onerror=null;this.src=""><h1 class="header truncate">' + data.name + '</h1><div id="chips"><a class="chip" href="javascript:window.history.back();"><i class="fas fa-arrow-alt-circle-left"></i>Go Back</a></div></br><a class="flow-text">' + (data.desc || "") + '</a></div><div class="card-tabs"><ul id="maintabs" class="tabs tabs-fixed-width"></ul></div>';
                for (let badge of data.badges) {
                    document.getElementById("chips").innerHTML += '<a class="chip tooltipped" data-tooltip="' + (badge.tip || "") + '" href="' + (badge.url || "") + '"><img src="' + (badge.img || "") + '">' + (badge.name || "") + "</a>"
                }
                break
            }
        }

        if (!document.getElementById("maintabs"))
            $info.innerHTML = '<div class="card-content"><h1 class="header truncate">Results for "' + c + '"</h1><div id="chips"><a class="chip" href="javascript:window.history.back();"><i class="fas fa-arrow-alt-circle-left"></i>Go Back</a></div></div><div class="card-tabs"><ul id="maintabs" class="tabs tabs-fixed-width"></ul></div>'


        load("launch?limit=200&mode=summary&sort=desc&name=" + c + "&format=stats" + (($query.type == "failures") ? "&status=4" : ""), function (data) {
            let loading = document.getElementById("loading")
            if (loading) {
                loading.parentNode.removeChild(loading)
            }

            if (data.launches.length) {
                $main.innerHTML += '<div id="results"><div id="next"></div><div id="switch" style="display:none" class="card-tabs"><ul class="tabs"><li class="tab"><a href="#past" class="active">Launched</a></li><li class="tab"><a href="#future">Upcoming</a></li></ul></div><div id="past"></div><div id="future"></div></div>';
                let $future = "";
                let $past = "";
                const $today = new Date();

                if (data.launches.length == 1) {
                    document.getElementById("maintabs").innerHTML = '<li class="tab"><a href="#results" class="active">Launches</a></li>' + document.getElementById("maintabs").innerHTML;
                    let launch = data.launches[0];
                    document.getElementById("next").innerHTML = '<div class="col s12"><div class="card"><div class="card-stacked"><div class="card-content"><h3 class="header black-text"><a class="tooltipped" data-tooltip="More info" href="/#rocket=' + launch.name.split(" | ")[0].split("/")[0] + '">' + launch.name.replace(" | ", "</a></h3><h2>") + '</h2><a class="chip tooltipped" data-tooltip="' + launch.net + '"><i class="far fa-clock"></i>' + ReadableDateString(launch.net) + '</a><h4 id="countdown' + launch.id + '">' + launch.status + '</h4></div><div class="card-action"><a class="waves-effect waves-light btn hoverable" href="/#id=' + launch.id + '">Details</a></div></div></div>';
                } else {
                    document.getElementById("maintabs").innerHTML = '<li class="tab"><a href="#stats">Stats</a></li>' + document.getElementById("maintabs").innerHTML;
                    document.getElementById("maintabs").innerHTML = '<li class="tab"><a href="#results" class="active">Launches</a></li>' + document.getElementById("maintabs").innerHTML;

                    for (let launch of data.launches) {
                        if (Date.parse(launch.net) < $today) {
                            $past += '<div class="col s12 m6"><div class="card"><div class="card-content"><h5 class="header truncate"><a class="tooltipped" data-tooltip="More info" href="/#rocket=' + launch.name.split(" | ")[0].split("/")[0] + '">' + launch.name.replace(" | ", "</a></h5><h4 class='header truncate'>") + '</h4><a class="chip tooltipped" data-tooltip="' + launch.net + '"><i class="far fa-clock"></i>' + ReadableDateString(launch.net) + "</a><h5>" + launch.status + '</h5></div><div class="card-action"><a class="waves-effect waves-light btn hoverable" href="/#id=' + launch.id + '">Watch</a></div></div></div>'
                        } else {
                            if (Date.parse(launch.net) > $today) {
                                $future = '<div class="col s12 m6"><div class="card"><div class="card-content"><h5 class="header truncate"><a class="tooltipped" data-tooltip="More info" href="/#rocket=' + launch.name.split(" | ")[0].split("/")[0] + '">' + launch.name.replace(" | ", "</a></h5><h4 class='header truncate'>") + '</h4><a class="chip tooltipped" data-tooltip="' + launch.net + '"><i class="far fa-clock"></i>' + ReadableDateString(launch.net) + "</a><h5>" + launch.status + '</h5></div><div class="card-action"><a class="waves-effect waves-light btn hoverable" href="/#id=' + launch.id + '">Details</a></div></div></div>' + $future;
                            }
                            if (launch.statuscode == 1 || launch.statuscode == 5 || launch.statuscode == 6) {
                                document.getElementById("next").innerHTML = '<div class="col s12"><div class="card"><div class="card-stacked"><div class="card-content"><h3 class="header black-text"><a class="tooltipped" data-tooltip="More info" href="/#rocket=' + launch.name.split(" | ")[0].split("/")[0] + '">' + launch.name.replace(" | ", "</a></h3><h2>") + '</h2><a class="chip tooltipped" data-tooltip="' + launch.net + '"><i class="far fa-clock"></i>' + ReadableDateString(launch.net) + '</a><h4 id="countdown' + launch.id + '">' + launch.status + '</h4></div><div class="card-action"><a class="waves-effect waves-light btn hoverable" href="/#id=' + launch.id + '">Details</a></div></div></div>';
                                if (launch.statuscode == 1 || launch.statuscode == 6)
                                    new Countdown(launch.net, "countdown" + launch.id);
                            }
                        }
                        if ($future && $past) {
                            document.getElementById("switch").style.display = "unset";
                        }
                        
                    }

                    document.getElementById("past").innerHTML = $past
                    document.getElementById("future").innerHTML = $future
                    
                    let labels = [];
                    let togo = [];
                    let success = [];
                    let fail = [];
                    for (let k in data.stats.byYear) {
                        if (k <= new Date().getUTCFullYear()) {
                            labels.push(parseInt(k));
                            togo.push(data.stats.byYear[k][1] + data.stats.byYear[k][2]);
                            success.push(data.stats.byYear[k][3]);
                            fail.push(data.stats.byYear[k][4]);
                        }
                    }

                    let rocketlist = "";
                    for (let i in data.rockets) {
                        rocketlist += '<li class="collection-item"><a href="/#rocket=' + data.rockets[i] + '">' + data.rockets[i] + '</a></li>'
                    }

                    let $stats = document.createElement("div");
                    $stats.id = "stats";
                    $main.appendChild($stats);
                    $stats.innerHTML += '<div class="col s12"><div class="card"><div class="video-container"><canvas id="launchesPerYear"></canvas></div></div></div>';
                    $stats.innerHTML += '<div class="col s12 m6"><div class="card-panel"><canvas id="successRate"></canvas><p class="flow-text">' + Math.abs(Math.round((1 - ((data.stats.byStatus[4] && data.stats.byStatus[4].length) || 0) / (data.stats.byStatus[3] && data.stats.byStatus[3].length || 0)) * 100)).toString().replace("-Infinity", "0") + '% </p></div></div>';
                    $stats.innerHTML += '<div class="col s12 m6"><div class="card-panel"><h1>' + (((data.stats.byStatus[1] && data.stats.byStatus[1].length) || 0) + ((data.stats.byStatus[2] && data.stats.byStatus[2].length) || 0)) + '</h1><p class="flow-text">Confirmed launch backlog</p></div></div>';
                    $stats.innerHTML += '<div class="col s12"><div class="card-panel"><h1>' + data.rockets.length + ' Rockets:</h1><ul class="collection">' + rocketlist + '</ul></div></div>';

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
                                data: [((data.stats.byStatus[4] && data.stats.byStatus[4].length) || 0), ((data.stats.byStatus[3] && data.stats.byStatus[3].length) || 0)],
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

                if (data.stats.byStatus[3])
                    document.getElementById("chips").innerHTML += '<a class="chip">' + data.stats.byStatus[3].length + ' successful launches</a>';
                if (data.stats.byStatus[4] && $query.type != "failures") {
                    document.getElementById("chips").innerHTML += '<a class="chip tooltipped" data-tooltip="Filter failures only" href="/' + (location.search || location.hash) + '&type=failures">' + data.stats.byStatus[4].length + ' failures</a>'
                } else if ($query.type == "failures") {
                    document.getElementById("chips").innerHTML += '<a class="chip">' + data.stats.byStatus[4].length + ' failures (Failures Only)</a>'
                }

            } else {
                if (document.getElementById("chips")) {
                    document.getElementById("chips").innerHTML += '<a class="chip">No launches</a>';
                }
                if (!document.getElementById("news") && !document.getElementById("information")) {
                    $main.innerHTML = '<h1 class="white-text">' + (data.msg || data.code).replace("None found", "No Launches") + '</h1></br>';
                }
            }
            materialize()
        })

    } else {
        $info.innerHTML = '<div class="card-content"><h1 class="header truncate">What are you looking for?</h1></div>';
        $main.innerHTML = '<div class="row"><div class="col s12"><div class="card"><div class="card-content"><div class="input-field"><input type="text" name="search"></div></div><div class="card-action"><a onclick="(location.hash = \'search=\' + document.getElementsByTagName(\'input\')[0].value)" class="waves-effect waves-light btn hoverable">Submit</a></div></div></div>';
    }
}