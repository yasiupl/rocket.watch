import {QueryString, load, materialize} from '../js/utils'

export default function launchcenter(m) {
    let $main = document.getElementsByTagName("main")[0];
    let $info = document.getElementById("info");
    let $query = QueryString();
    let k = document.createElement("div");
    $main.appendChild(k);
    let l = document.createElement("div");
    l.id = "information";
    l.className = "col s12"
    l.style.display = "none"
    $main.appendChild(l);

    if (m != "undefined") {
        load("location/" + m + "?mode=verbose", function (g) {
            if (g.locations.length) {
                let c = g.locations[0];

                document.getElementById("richEmbed").innerHTML = '{ "@context": "https://schema.org", "@type": "Organization", "name": "' + c.name + '", "url": "' + (c.infoURL || c.info) + '", "logo": "' + (c.icon || c.img) + '" }';

                $info.innerHTML = '<div class="card-content"><img class="circle materialboxed" src="' + c.img + '" onerror=this.onerror=null;this.style.display="none"><h1>' + c.name.split(", ")[0] + '</h1><div id="chips"><a class="chip" href="javascript:window.history.back();"><i class="fas fa-arrow-alt-circle-left"></i>Go Back</a><a class="chip tooltipped" data-tooltipped="Country summary" href="/#country=' + c.countryCode + '"><img src="' + c.countryFlag + '">' + c.name.split(", ")[1] + ", " + c.countryCode + '</a></div></div><div class="card-tabs"><ul id="maintabs" class="tabs tabs-fixed-width"></ul></div>';

                document.getElementById("maintabs").innerHTML = '<li class="tab"><a href="#information">Info</a></li>' + document.getElementById("maintabs").innerHTML;
                l.innerHTML = '<div class="card"><div class="video-container"><iframe src="' + c.map + '""></iframe></div></div>';
                if (c.info) {
                    l.innerHTML += '<div class="card"><div class="video-container"><iframe  src="' + c.info + '"></iframe></div></div>';
                }
                search("&padLocation=" + c.id);
            } else {
                r.innerHTML = '<h1 class="white-text" onclick="location.reload(true)">' + g.msg || g.status || "Error</h1>"
            }
        });
    } else {
        let page = parseInt($query.page) || 1;
        let perPage = 30;
        let offset = perPage * (page - 1);
        load("location?limit=" + perPage + "&mode=verbose&retired=0&offset=" + offset, function (c) {
            if (c.locations.length) {
                $info.innerHTML = '<div class="card-content"><h1>Launch Centers</h1><div id="chips"><div style="display:' + ((page == 1) ? 'none' : 'unset') + '" ><a class="chip" href="/#location&page=' + (page - 1) + '"><i id="pagination" class="fas fa-chevron-left"></i></a></div><a class="chip">Page ' + page + '</a><div style="display:' + ((page == Math.ceil(c.total / perPage)) ? 'none' : 'unset') + '"><a  class="chip" href="/#location&page=' + (page + 1) + '"><i id="pagination" class="fas fa-chevron-right"></i></a></div></div></div>';
                $main.innerHTML = ''
                for (let b in c.locations) {
                    let a = c.locations[b];
                    $main.innerHTML += '<div class="col s12 m6"><div class="card"><div class="card-content"><h5 class="header truncate">' + a.name + '</h5><a class="chip"><img src="' + a.countryFlag + '">' + a.countryCode + '</a></div><div class="card-action"><a class="waves-effect waves-light btn hoverable" href="/#location=' + a.id + '">Details</a></div></div>'
                }
                $main.innerHTML += '<div class="col s12"><div class="card"><ul class="pagination"><li class="' + ((page == 1) ? 'disabled" style="pointer-events:none;"' : "waves-effect") + '" ><a href="#location&page=' + (page - 1) + '"><i id="pagination" class="fas fa-chevron-left"></i></a></li> Page ' + page + "/" + Math.ceil(c.total / perPage) + ' <li class="' + ((page == Math.ceil(c.total / perPage)) ? 'disabled" style="pointer-events:none;"' : "waves-effect") + '"><a href="#location&page=' + (page + 1) + '"><i id="pagination" class="fas fa-chevron-right"></i></a></li></ul></div></div>'
            } else {
                $main.innerHTML = '<h1 class="white-text" onclick="location.reload(true)">' + c.msg || c.status || "Error</h1>"
            }

            // preload next
            load("location?limit=" + perPage + "&mode=verbose&retired=0&offset=" + (perPage * page));
        });
    }
    materialize();
}