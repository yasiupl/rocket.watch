import { QueryString, load, materialize } from '../js/utils'
import search from './search'

export default function pad(id) {
    let $main = document.getElementsByTagName("main")[0];
    let $info = document.getElementById("info");
    let $information_tab = document.createElement("div");
    $information_tab.id = "information";
    $information_tab.className = "col s12"
    $main.appendChild($information_tab);
    let $query = QueryString();

    if (id != "undefined") {
        load(`pad/${id}?mode=detailed`, function (pad) {
            if (!pad.detail) {

                $info.innerHTML =
                    `<div class="card-content">
                    <img class="circle materialboxed" src="${pad.map_image}" onerror=this.onerror=null;this.style.display="none">
                    <h1>${pad.name}</h1>
                    <div id="chips">
                        <a class="chip" href="javascript:window.history.back();"><i class="fas fa-arrow-alt-circle-left"></i>Go Back</a>
                        <a class="chip tooltipped" data-tooltip="More info" href="/#location=${pad.location.id}">
                            ${pad.location.name}
                        </a>
                    </div>
                </div>
                <div class="card-tabs">
                    <ul id="maintabs" class="tabs tabs-fixed-width"></ul>
                </div>`;

                document.getElementById("maintabs").innerHTML = '<li class="tab"><a href="#information">Info</a></li>' + document.getElementById("maintabs").innerHTML;
                $information_tab.innerHTML = `<div class="card"><div class="video-container"><iframe src="https://www.google.com/maps/embed/v1/place?key=AIzaSyDVnn_hI36-gqNndDceDStv2iLMRFvYTzE&maptype=satellite&q=${pad.latitude},${pad.longitude}"></iframe></div></div>`;
                if (pad.wiki_url) {
                    $information_tab.innerHTML += `<div class="card"><div class="video-container"><iframe  src="${pad.wiki_url}"></iframe></div></div>`;
                }
                //search("&pad__ids=" + pad.id);
                let loading = document.getElementById("loading")
                if (loading) {
                    loading.parentNode.removeChild(loading)
                }
                materialize();
            } else {
                $info.innerHTML = `<h1 class="white-text" onclick="location.reload(true)">${pad.detail || "Error"}</h1>`;
            }
        });
    } else {
        let page = parseInt($query.page) || 1;
        let perPage = 28;
        let offset = perPage * (page - 1);
        load(`pad?limit=${perPage}&offset=${offset}`, function (data) {
            if (!data.detail) {
                $info.innerHTML = '<div class="card-content"><h1>Launch pads</h1><div id="chips"><div style="display:' + ((page == 1) ? 'none' : 'unset') + '" ><a class="chip" href="/#pad&page=' + (page - 1) + '"><i id="pagination" class="fas fa-chevron-left"></i></a></div><a class="chip">Page ' + page + '</a><div style="display:' + ((page == Math.ceil(data.count / perPage)) ? 'none' : 'unset') + '"><a  class="chip" href="/#pad&page=' + (page + 1) + '"><i id="pagination" class="fas fa-chevron-right"></i></a></div></div></div>';
                $main.innerHTML = ''
                for (let pad of data.results) {
                    $main.innerHTML += 
                    `<div class="col s12 m6 l3">
                        <div class="card">
                            <div class="card-image">
                                <a href="#pad=${pad.id}">
                                    <img src="${pad.map_image}">
                                </a>
                                <span class="card-title">
                                    <a class="chip" href="#pad=${pad.id}">${pad.name}</a>
                                    <a class="chip" href="#location=${pad.location.id}">${pad.location.name}</a>
                                </span>
                            </div>
                        </div>
                    </div>`;
                }
                $main.innerHTML += '<div class="col s12"><div class="card"><ul class="pagination"><li class="' + ((page == 1) ? 'disabled" style="pointer-events:none;"' : "waves-effect") + '" ><a href="#pad&page=' + (page - 1) + '"><i id="pagination" class="fas fa-chevron-left"></i></a></li> Page ' + page + "/" + Math.ceil(data.count / perPage) + ' <li class="' + ((page == Math.ceil(data.count / perPage)) ? 'disabled" style="pointer-events:none;"' : "waves-effect") + '"><a href="#pad&page=' + (page + 1) + '"><i id="pagination" class="fas fa-chevron-right"></i></a></li></ul></div></div>'
            } else {
                $main.innerHTML = `<h1 class="white-text" onclick="location.reload(true)">${data.detail || "Error"}</h1>`
            }
        });
    }
    materialize();
}
