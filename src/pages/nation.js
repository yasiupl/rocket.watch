import {load, materialize} from '../js/utils'

export default function nation(code) {
    let $main = document.getElementsByTagName("main")[0];
    let $info = document.getElementById("info");

    $info.innerHTML = 
    `<div class="card-content">
        <h1>${code}</h1>
        <a class="chip" href="javascript:window.history.back();"><i class="fas fa-arrow-alt-circle-left"></i>Go Back</a>
        </div>
            <div class="card-tabs">
                <ul id="maintabs" class="tabs tabs-fixed-width"></ul>
            </div>
        </div>
    </div>`;

    load(`agencies?country_code=${code}`, function (data) {
        if (!data.detail) {
            $main.innerHTML = '';
            document.getElementById("maintabs").innerHTML += '<li class="tab"><a href="#agencies">Agencies</a></li>';
            let $agencies = document.createElement("div");
            $agencies.id = "agencies";
            $main.appendChild($agencies);
            for (let agency of data.results) {
                $agencies.innerHTML += 
                `<div class="col s12 m4">
                    <div class="card">
                        <div class="card-content">
                            <h5 class="header truncate">${agency.name}</h5>
                            <a class="chip">${agency.type} Agency</a>
                        </div>
                        <div class="card-action">
                            <a class="waves-effect waves-light btn hoverable" href="/#agency=${agency.id}">Details</a>
                        </div>
                    </div>
                </div>`;
            }
        } else {
            $info.innerHTML = `<h1 class="white-text" onclick="location.reload(true)">${data.detail || "Error"}</h1>`;
        }
        load(`location?country_code=${code}`, function (data) {
            if (data.results.length) {
                document.getElementById("maintabs").innerHTML += '<li class="tab"><a href="#locations">Launch Locations</a></li>';
                let $locations = document.createElement("div");
                $locations.id = "locations";
                $main.appendChild($locations);
                for (const location of data.results) {
                    $locations.innerHTML += 
                    `<div class="col s12 m6 l4">
                        <div class="card">
                            <div class="card-image">
                                <a  href="/#location=${location.id}">
                                    <img src="${location.map_image || '/assets/rocket_placeholder.jpg'}">
                                </a>
                                <span class="card-title">
                                    <a class="chip" href="/#location=${location.id}">${location.name}</a>
                                    <a class="chip">${location.total_launch_count || "No"} Launches</a>
                                    <a class="chip">${location.total_landing_count || "No"} Landings</a>
                                </span>
                            </div>
                        </div>
                    </div>`;
                }
            }
            materialize();
        });
    });
}