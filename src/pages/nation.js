import {load, materialize} from '../js/utils'

export default function nation(code) {
    let $main = document.getElementsByTagName("main")[0];
    let $info = document.getElementById("info");
    load(`agencies?country_code=${code}`, function (data) {
        if (!data.detail) {
            let first_agency = data.results[0];
            $info.innerHTML = 
            `<div class="card-content">
                <h1>${code}</h1>
                <a class="chip" href="javascript:window.history.back();"><i class="fas fa-arrow-alt-circle-left"></i>Go Back</a>
                </div>
                    <div class="card-tabs">
                        <ul id="maintabs" class="tabs tabs-fixed-width">
                            <li class="tab">
                                <a href="#agencies">Agencies</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>`;
            $main.innerHTML = '';
            let $agencies = document.createElement("div");
            $agencies.id = "agencies";
            $main.appendChild($agencies);
            for (let agency of data.results) {
                $agencies.innerHTML += 
                `<div class="col s12 m6">
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
            $main.innerHTML = `<h1 class="white-text" onclick="location.reload(true)">${data.detail}</h1>`;
        }

        load(`location?country_code=${code}`, function (data) {
            if (data.results.length) {
                document.getElementById("maintabs").innerHTML += '<li class="tab"><a href="#locations">Launch Locations</a></li>';
                let $locations = document.createElement("div");
                $locations.id = "locations";
                $main.appendChild($locations);
                for (let location of data.results) {
                    $locations.innerHTML += 
                    `<div class="col s12 m6">
                        <div class="card">
                            <div class="card-content">
                                <h5 class="header truncate">${location.name}</h5>
                            </div>
                            <div class="card-action">
                                <a class="waves-effect waves-light btn hoverable" href="/#location=${location.id}">Details</a>
                            </div>
                        </div>
                    </div>`;
                }
            }
            materialize();
        });
        materialize();
    });
}