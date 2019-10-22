import {load, ReadableDateString} from '../js/utils'

export default function timeline(k, page) {
    let $main = document.getElementsByTagName("main")[0];
    let $info = document.getElementById("info");
    page = parseInt(page) || 1;
    let perPage = 20;
    let offset = perPage * (page - 1);
    $main.innerHTML = ""

    load("launch?mode=verbose&limit=" + perPage + (k ? "&sort=desc&status=3,4,7" : "&status=1,2,5,6") + "&offset=" + offset, function (a) {
        for (let c in a.launches) {
            let b = a.launches[c];
            $main.innerHTML += '<div class="col s12 m6"><div class="card"><div class="card-content"><h5 class="header black-text truncate"><a style="color:black" class="tooltipped" data-tooltip="More info" href="/#rocket=' + b.name.split(" |")[0].split("/")[0] + '">' + b.name.replace(" | ", "</a></h5><h4 class='header black-text truncate'>") + '</h4><a class="chip tooltipped" data-tooltip="' + b.agency.name + '" href="/#agency=' + b.agency.id + '"><img src="' + b.agency.icon + '?size=32" onerror=this.src="' + b.agency.countryFlag + '">' + b.agency.shortname + '</a><a class="chip tooltipped" data-tooltip="' + b.location.name + '" href="/#pad=' + b.location.pads[0].id + '"><i class="far fa-compass"></i>' + b.location.name.split(",")[0] + '</a></br><a class="chip tooltipped" data-tooltip="' + b.net + '"><i class="far fa-clock"></i>' + ReadableDateString(b.net) + '</a><h5 id="countdown' + b.id + '">' + b.status + '</h5></div><div class="card-action"><a class="waves-effect waves-light btn hoverable" href="/#id=' + b.id + '">More</a></div></div>';
            if (b.statuscode == 1 || b.statuscode == 6) {
                new Countdown(b.net, "countdown" + b.id)
            }
        }
        if (k) {
            $info.innerHTML = '<div class="card-content"><h1>Historical launches</h1><div id="chips"><div style="display:' + ((page == 1) ? 'none' : 'unset') + '" ><a class="chip" href="/#history=' + (page - 1) + '"><i id="pagination" class="fas fa-chevron-left"></i></a></div><a class="chip">Page ' + page + '</a><div style="display:' + ((page == Math.ceil(a.total / perPage)) ? 'none' : 'unset') + '"><a  class="chip" href="/#history=' + (page + 1) + '"><i id="pagination" class="fas fa-chevron-right"></i></a></div></div></div>';
            $main.innerHTML += '<div class="col s12"><div class="card"><div style="display:' + ((page == 1) ? 'none' : 'unset') + '" ><a class="chip" href="/#history=' + (page - 1) + '"><i id="pagination" class="fas fa-chevron-left"></i></a></div><a class="chip">Page ' + page + '</a><div style="display:' + ((page == Math.ceil(a.total / perPage)) ? 'none' : 'unset') + '"><a  class="chip" href="/#history=' + (page + 1) + '"><i id="pagination" class="fas fa-chevron-right"></i></a></div></div></div>'

        } else {
            $info.innerHTML = '<div class="card-content"><h1>Planned launches</h1><div id="chips"><div style="display:' + ((page == 1) ? 'none' : 'unset') + '" ><a class="chip" href="/#future=' + (page - 1) + '"><i id="pagination" class="fas fa-chevron-left"></i></a></div><a class="chip">Page ' + page + '</a><div style="display:' + ((page == Math.ceil(a.total / perPage)) ? 'none' : 'unset') + '"><a  class="chip" href="/#future=' + (page + 1) + '"><i id="pagination" class="fas fa-chevron-right"></i></a></div></div></div></div>';
            $main.innerHTML += '<div class="col s12"><div class="card"><div style="display:' + ((page == 1) ? 'none' : 'unset') + '" ><a class="chip" href="/#future=' + (page - 1) + '"><i id="pagination" class="fas fa-chevron-left"></i></a></div><a class="chip">Page ' + page + '</a><div style="display:' + ((page == Math.ceil(a.total / perPage)) ? 'none' : 'unset') + '"><a  class="chip" href="/#future=' + (page + 1) + '"><i id="pagination" class="fas fa-chevron-right"></i></a></div></div></div>'
        }

        //preload next action;
        load("launch?mode=verbose&limit=" + perPage + (k ? "&sort=desc&status=3,4,7" : "&status=1,2,5,6") + "&offset=" + (perPage * page));
    });
}
