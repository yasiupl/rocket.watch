import Chart from 'chart.js';
import 'materialize-css/dist/js/materialize.min.js'
import './js/fontawesome'
import {QueryString} from './js/utils'
import home from './pages/home.js'
import watch from './pages/watch'
import agency from './pages/agency'
import launchcenter from './pages/launchcenter'
import nation from './pages/nation'
import pad from './pages/pad'
import rocket from './pages/rocket'
import timeline from './pages/timeline'
import settings from './pages/settings'
import search from './pages/search'

console.log("rocket.watch");

window.addEventListener("hashchange", init);
window.addEventListener("DOMContentLoaded", init);

window.OneSignal = window.OneSignal || [];
window.OneSignal.push(function () {
    window.OneSignal.init({
        appId: "d15cb12b-085c-4f0b-a40a-45dbdcba9e7c",
        notifyButton: {
            enable: true,
        },
        allowLocalhostAsSecureOrigin: true,
    });
});

if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker
            .register('./OneSignalSDKWorker.js')
            .then(function () {
                console.log('rocket.watch serviceworker install successful');
            })

            .catch(function (err) {
                console.log('rocket.watch serviceworker install failed: ', err);
            });
    });
}

if (localStorage.getItem("rocketwatch.settings")) {
    window.$settings = JSON.parse(localStorage.getItem("rocketwatch.settings"));
    if ($settings.dark) {
        document.querySelector("body").className += " dark";
    }
} else {
    window.$settings = {
        dark: false,
    };
    localStorage.setItem("rocketwatch.settings", JSON.stringify(window.$settings))
}



function init() {
    let $main = document.getElementsByTagName("main")[0];
    let $info = document.getElementById("info");
    document.getElementById("background").innerHTML = "";
    $info.innerHTML = '<div class="card-content"><h1 class="white-text" id="loading-message">Loading...</h1></div>';
    $main.innerHTML = '<div id="loading" style="height:500px"><div class="rocket"><div class="rocket-body"><div class="body"></div><div class="fin fin-left"></div><div class="fin fin-right"></div><div class="window"></div></div><div class="exhaust-flame"></div><ul class="exhaust-fumes"><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li></ul><ul class="star"><li></li><li></li><li></li><li></li><li></li><li></li><li></li></ul></div></div>';
    $main.className = "container";
    delete $main.id;

    window.countdowns = window.countdowns || [];
    for (let d in countdowns) {
        window.clearInterval(countdowns[d])
    }
    let tooltips = document.querySelectorAll('.material-tooltip');
    if (tooltips.length) {
        for (let i in tooltips) {
            if (i == (tooltips.length - 1)) break
            tooltips[i].parentElement.removeChild(tooltips[i]);
        }
    }
    document.title = "rocket.watch";
    window.scrollTo(0, 0);
    document.querySelector('.sidenav').style.transform = "translateX(-105%)";
    if (document.querySelector('.sidenav-overlay'))
        document.querySelector('.sidenav-overlay').style.display = "none";

    // This is what you would call a "router"

    QueryString(function (b) {
        let launched = 0;
        if (b.id) {
            watch(b.id);
            launched++
        }
        if (b.event) {
            watch(b.event, "customlive");
            launched++
        }
        if (b.agency) {
            agency(b.agency);
            launched++
        }
        if (b.pad) {
            pad(b.pad);
            launched++
        }
        if (b.location) {
            launchcenter(b.location);
            launched++
        }
        if (b.rocket) {
            rocket(b.rocket);
            launched++
        }
        if (b.search) {
            search(b.search);
            launched++
        }
        if (b.collection) {
            search(b.collection + '&sort=asc');
            launched++
        }
        if (b.country) {
            nation(b.country);
            launched++
        }
        if (b.history) {
            timeline(1, b.history || b.page || 1);
            launched++
        }
        if (b.future) {
            timeline(0, b.future || b.page || 1);
            launched++
        }
        if (b.settings) {
            settings();
            launched++
        }
        if (!launched) {
            home();
        }

        if (navigator.onLine) {
            setTimeout(function () {
                if (document.getElementById("loading-message"))
                    document.getElementById("loading-message").innerHTML = '<h1>Hold on.</h1><h5 style="cursor: pointer;" onclick="location.reload(true)">Try again</h5>'
            }, 6000);
        } else {
            document.getElementById("loading-message").innerHTML = '<h1>You\'re offline</h1><h5>Check your internet connection</h5>';
        }
        //window.history.pushState(undefined, undefined, (location.search || location.hash).replace("#", "?"));
    });

}
