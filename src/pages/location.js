import { QueryString, load, materialize } from '../js/utils'
import search from './search'

export default function location(id) {
    let $main = document.getElementsByTagName("main")[0];
    let $info = document.getElementById("info");
    let $query = QueryString();
    let k = document.createElement("div");
    $main.appendChild(k);
    let l = document.createElement("div");
    l.id = "pads";
    l.className = "col s12"
    l.style.display = "none"
    $main.appendChild(l);

    if (id != "undefined") {
        load(`location/${id}`, function (location) {
            if (!location.detail) {
                $info.innerHTML = 
                `<div class="card-content">
                    <img class="circle materialboxed" src="${location.map_image}" onerror=this.onerror=null;this.style.display="none">
                    <h1>${location.name.split(", ")[0]}</h1>
                    <div id="chips">
                        <a class="chip" href="javascript:window.history.back();">
                            <i class="fas fa-arrow-alt-circle-left"></i>
                            Go Back
                        </a>
                        <a class="chip tooltipped" data-tooltipped="Country summary" href="/#country=${location.country_code}">
                            ${location.name.split(", ")[1] + ", " + location.country_code}
                        </a>
                        <a class="chip">
                            ${location.total_launch_count} Launches
                        </a>
                    </div>
                </div>
                <div class="card-tabs"><ul id="maintabs" class="tabs tabs-fixed-width"></ul></div>`;

                /*
                document.getElementById("maintabs").innerHTML = `<li class="tab"><a href="#information">Info</a></li>${document.getElementById("maintabs").innerHTML;
                
                l.innerHTML = `<div class="card"><div class="video-container"><iframe src="${c.map}""></iframe></div></div>`;
                if (c.info) {
                    l.innerHTML += `<div class="card"><div class="video-container"><iframe  src="${c.info}"></iframe></div></div>`;
                }
                */

                search("&location__ids=" + location.id);

                document.getElementById("maintabs").innerHTML = `<li class="tab"><a href="#pads">Launch Pads</a></li>${document.getElementById("maintabs").innerHTML}`;

                for (let pad of location.pads) {
                    l.innerHTML += `<div class="col s12 m6"><div class="card"><div class="card-content"><h5 class="header truncate">${pad.name}</h5><a class="chip">${location.total_launch_count} launches</a></div><div class="card-action"><a class="waves-effect waves-light btn hoverable" href="/#pad=${pad.id}">Details</a></div></div>`;
                }

            } else {
                $info.innerHTML = `<h1 class="white-text" onclick="location.reload(true)">${(location.detail || "Error")}</h1>`;
            }
        });
    } else {
        let page = parseInt($query.page) || 1;
        let perPage = 30;
        let offset = perPage * (page - 1);
        load(`location?limit=${perPage}&offset=${offset}`, function (data) {
            if (data.results.length) {
                $info.innerHTML = 
                `<div class="card-content">
                    <h1>Launch Centers</h1>
                    <div id="chips">
                        <div style="display:${((page == 1) ? 'none' : 'unset')}" >
                            <a class="chip" href="/#location&page=${(page - 1)}">
                                <i id="pagination" class="fas fa-chevron-left"></i>
                            </a>
                        </div>
                        <a class="chip">Page ${page}</a><div style="display:${((page == Math.ceil(data.count / perPage)) ? 'none' : 'unset')}">
                        <a  class="chip" href="/#location&page=${(page + 1)}">
                            <i id="pagination" class="fas fa-chevron-right"></i>
                        </a>
                    </div>
                </div>`;

                $main.innerHTML = ``;
                for (let location of data.results) {
                    $main.innerHTML += 
                    `<div class="col s12 m6">
                        <div class="card">
                            <div class="card-content">
                                <h5 class="header truncate">${location.name}</h5>
                                <a class="chip">${location.country_code}</a>
                            </div>
                            <div class="card-action">
                                <a class="waves-effect waves-light btn hoverable" href="/#location=${location.id}">
                                    Details
                                </a>
                            </div>
                        </div>
                    </div>`;
                }

                $main.innerHTML += 
                `<div class="col s12">
                    <div class="card">
                        <ul class="pagination">
                            <li class="${((page == 1) ? 'disabled" style="pointer - events: none; "' : "waves - effect")}" >
                                <a href="#location&page=${(page - 1)}">
                                    <i id="pagination" class="fas fa-chevron-left"></i>
                                </a>
                            </li>
                            Page ${page} / ${Math.ceil(data.count / perPage)}
                            <li class="${((page == Math.ceil(data.count / perPage)) ? 'disabled" style="pointer-events:none;"' : "waves-effect")}">
                                <a href="#location&page=${(page + 1)}">
                                    <i id="pagination" class="fas fa-chevron-right"></i>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>`;
            } else {
                $main.innerHTML = `<h1 class="white-text" onclick="location.reload(true)">${data.detail || "Error"}</h1>`
            }

            // preload next page
            load(`location?limit=${perPage}&offset=${offset * perPage}`);
        });
    }
    materialize();
}