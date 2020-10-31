import { load, ReadableDateString, Countdown, getLongStatusName } from '../js/utils'

export default function timeline(term, page) {
    let $main = document.getElementsByTagName("main")[0];
    let $info = document.getElementById("info");
    page = parseInt(page) || 1;
    let perPage = 20;
    let offset = perPage * (page - 1);
    $main.innerHTML = ""

    load(`launch/${term ? "previous/?status=3" : "upcoming/?status=2"}&limit=${perPage}&offset=${offset}&mode=detailed`, function (data) {
        if (!data.detail) {
            for (let launch of data.results) {
                $main.innerHTML +=
                    `<div class="col s12 m6">
                <div class="card">
                    <div class="card-content">
                        <h5 class="header truncate">
                            <a class="tooltipped" data-tooltip="More info" href="/#rocket=${launch.name.split(" |")[0].split("/")[0]}">
                                ${launch.name.replace(" | ", "</a></h5><h4 class='header truncate'>")}
                                </h4>
                        <a class="chip tooltipped" data-tooltip="${launch.launch_service_provider.name}" href="/#agency=${launch.launch_service_provider.id}">
                            <img src="${launch.launch_service_provider.logo_url}">
                            ${(launch.launch_service_provider.name.length > 12) ? launch.launch_service_provider.abbrev : launch.launch_service_provider.name}
                        </a>
                        <a class="chip tooltipped" data-tooltip="${launch.pad.location.name}" href="/#pad=${launch.pad.location.id}">
                            <i class="far fa-compass"></i>
                            ${launch.pad.location.name.split(",")[0]}
                        </a>
                        </br>
                        <a class="chip tooltipped" data-tooltip="${launch.net}">
                            <i class="far fa-clock"></i>
                            ${ReadableDateString(launch.net)}
                        </a>
                        <h5 id="countdown-${launch.id}">${getLongStatusName(launch.status.id)}</h5>
                    </div>
                    <div class="card-action">
                        <a class="waves-effect waves-light btn hoverable" href="/#id=${launch.launch_library_id || launch.slug}">
                            More
                        </a>
                    </div>
                </div>
            </div>`;

                if (launch.status.id == 1 || launch.status.id == 6) {
                    new Countdown(launch.net, "countdown" + launch.id)
                }
            }
            if (term) {
                $info.innerHTML = '<div class="card-content"><h1>Historical launches</h1><div id="chips"><div style="display:' + ((page == 1) ? 'none' : 'unset') + '" ><a class="chip" href="/#history=' + (page - 1) + '"><i id="pagination" class="fas fa-chevron-left"></i></a></div><a class="chip">Page ' + page + '</a><div style="display:' + ((page == Math.ceil(data.total / perPage)) ? 'none' : 'unset') + '"><a  class="chip" href="/#history=' + (page + 1) + '"><i id="pagination" class="fas fa-chevron-right"></i></a></div></div></div>';
                $main.innerHTML += '<div class="col s12"><div class="card"><div style="display:' + ((page == 1) ? 'none' : 'unset') + '" ><a class="chip" href="/#history=' + (page - 1) + '"><i id="pagination" class="fas fa-chevron-left"></i></a></div><a class="chip">Page ' + page + '</a><div style="display:' + ((page == Math.ceil(data.total / perPage)) ? 'none' : 'unset') + '"><a  class="chip" href="/#history=' + (page + 1) + '"><i id="pagination" class="fas fa-chevron-right"></i></a></div></div></div>'

            } else {
                $info.innerHTML = '<div class="card-content"><h1>Planned launches</h1><div id="chips"><div style="display:' + ((page == 1) ? 'none' : 'unset') + '" ><a class="chip" href="/#future=' + (page - 1) + '"><i id="pagination" class="fas fa-chevron-left"></i></a></div><a class="chip">Page ' + page + '</a><div style="display:' + ((page == Math.ceil(data.total / perPage)) ? 'none' : 'unset') + '"><a  class="chip" href="/#future=' + (page + 1) + '"><i id="pagination" class="fas fa-chevron-right"></i></a></div></div></div></div>';
                $main.innerHTML += '<div class="col s12"><div class="card"><div style="display:' + ((page == 1) ? 'none' : 'unset') + '" ><a class="chip" href="/#future=' + (page - 1) + '"><i id="pagination" class="fas fa-chevron-left"></i></a></div><a class="chip">Page ' + page + '</a><div style="display:' + ((page == Math.ceil(data.total / perPage)) ? 'none' : 'unset') + '"><a  class="chip" href="/#future=' + (page + 1) + '"><i id="pagination" class="fas fa-chevron-right"></i></a></div></div></div>'
            }
        } else {
            $info.innerHTML = `<h1 class="white-text" onclick="location.reload(true)">${data.detail || "Error"}</h1>`;
        }
    });
}
