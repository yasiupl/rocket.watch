import {QueryString, load, materialize} from '../js/utils'
import search from './search'

export default function rocket(m) {
    let $main = document.getElementsByTagName("main")[0];
    let $info = document.getElementById("info");
    let $query = QueryString();
    if (m != "undefined") {
        load("rocket/" + m + "?mode=verbose", function (c) {
            if (c.rockets.length) {
                let a = c.rockets[0];

                $info.innerHTML = '<div class="card-content"><img class="circle materialboxed" src="' + a.img + '" onerror=this.onerror=null;this.style.display="none"><h1>' + a.name + '</h1><div id="chips"><a class="chip" href="javascript:window.history.back();"><i class="fas fa-arrow-alt-circle-left"></i>Go Back</a><a class="chip tooltipped" data-tooltip="More info" href="/#country=' + (a.agency.countryCode || 'UNK') + '"><img src="' + a.agency.countryFlag + '">' + (a.agency.countryCode || 'Unknown Country') + '</a><a class="chip tooltipped" data-tooltip="More info" href="/#agency=' + a.agency.id + '"><img src="' + a.agency.icon + '">' + (a.agency.shortname || 'Unknown Agency Name') + '</a></div><p class="flow-text">' + (a.description || '') + '</p></div><div class="card-tabs"><ul id="maintabs" class="tabs tabs-fixed-width"></ul></div>';

                if (a.wiki.length) {
                    $main.innerHTML += '<div id="information"><div class="card"><div class="video-container"><iframe  src="' + a.wiki.replace("http://", "https://") + '"></iframe></div></div></div>'
                    document.getElementById("maintabs").innerHTML = '<li class="tab"><a href="#information">Info</a></li>' + document.getElementById("maintabs").innerHTML;
                }

                search("&rocketid=" + a.id);
            } else {
                $main.innerHTML = '<h1 class="white-text" onclick="location.reload(true)">' + c.msg || c.status || "Error</h1>"
            }
        });
    } else {
        let page = parseInt($query.page) || 1;
        let perPage = 27;
        let offset = perPage * (page - 1);
        load("rocket?mode=verbose&limit=" + perPage + "&offset=" + offset, function (c) {
            if (c.rockets.length > 0) {
                $info.innerHTML = '<div class="card-content"><h1>Rockets</h1><div id="chips"><div style="display:' + ((page == 1) ? 'none' : 'unset') + '" ><a class="chip" href="/#rocket&page=' + (page - 1) + '"><i id="pagination" class="fas fa-chevron-left"></i></a></div><a class="chip">Page ' + page + '</a><div style="display:' + ((page == Math.ceil(c.total / perPage)) ? 'none' : 'unset') + '"><a  class="chip" href="/#rocket&page=' + (page + 1) + '"><i id="pagination" class="fas fa-chevron-right"></i></a></div></div></div>';
                $main.innerHTML = '';
                for (let b in c.rockets) {
                    let a = c.rockets[b];
                    $main.innerHTML += '<div class="col s12 m6 l4"><div class="card"><div class="card-image"><a href="/#rocket=' + a.id + '"><img src="' + (a.img || "https://rocket.watch/assets/rocket_placeholder.jpg") + '" ></a><span class="card-title"><a class="chip" href="/#agency=' + a.agency.id + '">' + a.agency.name + '</a><a class="chip" href="/#rocket=' + a.id + '">' + a.name + '</a></span></div></div></div>'
                }
                $main.innerHTML += '<div class="col s12"><div class="card"><ul class="pagination"><li class="' + ((page == 1) ? 'disabled" style="pointer-events:none;"' : "waves-effect") + '" ><a href="/#rocket&page=' + (page - 1) + '"><i id="pagination" class="fas fa-chevron-left"></i></a></li> Page ' + page + "/" + Math.ceil(c.total / perPage) + ' <li class="' + ((page == Math.ceil(c.total / perPage)) ? 'disabled" style="pointer-events:none;"' : "waves-effect") + '"><a href="/#rocket&page=' + (page + 1) + '"><i id="pagination" class="fas fa-chevron-right"></i></a></li></ul></div></div>'
            } else {
                $main.innerHTML = '<h1 class="white-text" onclick="location.reload(true)">' + c.msg || c.status || "Error</h1>"
            }

            // preload next
            load("rocket?mode=verbose&limit=" + perPage + "&offset=" + (perPage * page));
        });
    }
    materialize();
}