import {load, materialize} from '../js/utils'

export default function nation(k) {
    let $main = document.getElementsByTagName("main")[0];
    let $info = document.getElementById("info");
    load("agency?islsp=1&countryCode=" + k, function (a) {
        if (a.agencies.length) {
            let c = a.agencies[0];
            $info.innerHTML = '<div class="card-content"><img class="circle materialboxed" src="' + c.countryFlag + '" onerror=this.onerror=null;this.style.display="none"><h1>' + k + '</h1><a class="chip" href="javascript:window.history.back();"><i class="fas fa-arrow-alt-circle-left"></i>Go Back</a></div><div class="card-tabs"><ul id="maintabs" class="tabs tabs-fixed-width"><li class="tab"><a href="#agencies">Agencies</a></li></ul></div></div>';
            $main.innerHTML = '';
            let $agencies = document.createElement("div");
            $agencies.id = "agencies";
            $main.appendChild($agencies);
            for (let c in a.agencies) {
                c = a.agencies[c];
                $agencies.innerHTML += '<div class="col s12 m6"><div class="card"><div class="card-content"><h5 class="header truncate">' + c.name + '</h5><a class="chip"><img src="' + c.icon + '" onerror=this.onerror=null;this.style.display="none">' + c.abbrev + '</a><a class="chip">' + c.type + ' Agency</a></div><div class="card-action"><a class="waves-effect waves-light btn hoverable" href="/#agency=' + c.id + '">Details</a></div>'
            }
        } else {
            $main.innerHTML = '<h1 class="white-text" onclick="location.reload(true)">Not found</h1>'
        }
        load("location?countrycode=" + k, function (c) {
            if (c.locations.length) {
                document.getElementById("maintabs").innerHTML += '<li class="tab"><a href="#locations">Launch Locations</a></li>';
                let $locations = document.createElement("div");
                $locations.id = "locations";
                $main.appendChild($locations);
                for (let b in c.locations) {
                    let a = c.locations[b];
                    $locations.innerHTML += '<div class="col s12 m6"><div class="card"><div class="card-content"><h5 class="header truncate">' + a.name + '</h5><a class="chip"><img src="' + a.countryFlag + '">' + a.countryCode + '</a></div><div class="card-action"><a class="waves-effect waves-light btn hoverable" href="/#location=' + a.id + '">Details</a></div></div>'
                }
            }
            materialize();
        });
    });
}