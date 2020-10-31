import { QueryString, load, materialize } from '../js/utils'
import search from './search'

export default function rocket(id) {
    let $main = document.getElementsByTagName("main")[0];
    let $info = document.getElementById("info");
    let $query = QueryString();
    if (id != "undefined") {
        load(`config/launcher/${id}`, function (launcher) {
            if (!launcher.detail) {

                $info.innerHTML =
                    `<div class="card-content">
                    <img class="circle materialboxed" src="${launcher.image_url}" onerror=this.onerror=null;this.style.display="none">
                    <h1>${launcher.name}</h1>
                    <div id="chips">
                        <a class="chip" href="javascript:window.history.back();"><i class="fas fa-arrow-alt-circle-left"></i>Go Back</a>
                        <a class="chip tooltipped" data-tooltip="More info" href="/#agency=${launcher.manufacturer && launcher.manufacturer.id}">
                            <img src="${launcher.manufacturer.logo_url}">
                            ${launcher.manufacturer.name}
                        </a>
                        <a class="chip tooltipped" data-tooltip="More info" href="/#country=${launcher.manufacturer && launcher.manufacturer.country_code || 'UNK'}">
                            ${launcher.manufacturer && launcher.manufacturer.country_code || 'Unknown Country'}
                        </a>
                    </div>
                    <p class="flow-text">${launcher.description}</p>
                </div>
                <div class="card-tabs">
                    <ul id="maintabs" class="tabs tabs-fixed-width"></ul>
                </div>`;

                if (launcher.wiki_url) {
                    $main.innerHTML +=
                        `<div id="information">
                        <div class="card">
                            <div class="video-container">
                                <iframe  src="${launcher.wiki_url.replace("http://", "https://")}"></iframe>
                            </div>
                        </div>
                    </div>`;
                    document.getElementById("maintabs").innerHTML = '<li class="tab"><a href="#information">Info</a></li>' + document.getElementById("maintabs").innerHTML;
                }

                search("&launcher_config__id=" + launcher.id);
            } else {
                $info.innerHTML = `<h1 class="white-text" onclick="location.reload(true)">${launcher.detail || "Error"}</h1>`;
            }
        });
    } else {
        let page = parseInt($query.page) || 1;
        let perPage = 27;
        let offset = perPage * (page - 1);
        load(`config/launcher?limit=${perPage}&offset=${offset}`, function (data) {
            if (!data.detail) {
                $info.innerHTML = '<div class="card-content"><h1>Rockets</h1><div id="chips"><div style="display:' + ((page == 1) ? 'none' : 'unset') + '" ><a class="chip" href="/#rocket&page=' + (page - 1) + '"><i id="pagination" class="fas fa-chevron-left"></i></a></div><a class="chip">Page ' + page + '</a><div style="display:' + ((page == Math.ceil(data.count / perPage)) ? 'none' : 'unset') + '"><a  class="chip" href="/#rocket&page=' + (page + 1) + '"><i id="pagination" class="fas fa-chevron-right"></i></a></div></div></div>';
                $main.innerHTML = '';
                for (const launcher of data.results) {
                    $main.innerHTML +=
                    `<div class="col s12 m6 l4">
                        <div class="card">
                            <div class="card-image">
                                <a href="/#rocket=${launcher.id}">
                                    <img src="${launcher.image_url || "https://rocket.watch/assets/rocket_placeholder.jpg"}" >
                                </a>
                                <span class="card-title">
                                    <a class="chip" href="/#agency=${launcher.manufacturer.id}">${launcher.manufacturer.name}</a>
                                    <a class="chip" href="/#rocket=${launcher.id}">${launcher.name}</a>
                                </span>
                            </div>
                        </div>
                    </div>`;
                }
                $main.innerHTML += '<div class="col s12"><div class="card"><ul class="pagination"><li class="' + ((page == 1) ? 'disabled" style="pointer-events:none;"' : "waves-effect") + '" ><a href="/#rocket&page=' + (page - 1) + '"><i id="pagination" class="fas fa-chevron-left"></i></a></li> Page ' + page + "/" + Math.ceil(data.count / perPage) + ' <li class="' + ((page == Math.ceil(data.count / perPage)) ? 'disabled" style="pointer-events:none;"' : "waves-effect") + '"><a href="/#rocket&page=' + (page + 1) + '"><i id="pagination" class="fas fa-chevron-right"></i></a></li></ul></div></div>';
            } else {
                $info.innerHTML = `<h1 class="white-text" onclick="location.reload(true)">${data.detail || "Error"}</h1>`
            }


        });
    }
    materialize();
}