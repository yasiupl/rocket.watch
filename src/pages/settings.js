import {saveValue} from '../js/utils'

export default function settings() {
    let $main = document.getElementsByTagName("main")[0];
    let $info = document.getElementById("info");

    $info.innerHTML = '<div class="card-content"><img class="circle" src="assets/settings.png" =this.onerror=null;this.display="none"><h1 class="header truncate">Settings</h1><div id="chips"><a class="chip" href="javascript:window.history.back();"><i class="fas fa-arrow-alt-circle-left"></i>Go Back</a></div>';

    $main.innerHTML = '<div class="card"><div class="card-content"><a class="waves-effect waves-light btn hoverable" id="restart">Clear Settings and Site Data</a><a class="waves-effect waves-light btn hoverable" onclick="location.reload(true);">Reload</a></div></div>';

    $main.innerHTML += '<div class="card"><div class="card-content"> <h3 class="header">Preferences</h3><ul class="collection with-header" id="preferences"></ul></div></div>';

    document.getElementById("restart").onclick = restart;


    let settings_names = {
        dark: "Dark Mode",
    };

    for (let i in $settings) {
        document.getElementById("preferences").innerHTML += '<li class="collection-item"><p><label><input type="checkbox" id="' + i + '" ' + (($settings[i]) ? "checked" : "") + ' /><span>' + (settings_names[i] ? settings_names[i] : i) + '</span></label></p></li>';
        document.getElementById(i).onclick = saveValue
    }

}
