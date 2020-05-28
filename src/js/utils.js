const backendURL = "https://api.rocket.watch/";

export function materialize() {
    M.Sidenav.init(document.querySelector('.sidenav'));
    M.Sidenav.getInstance(document.querySelector('.sidenav')).close()
    M.Materialbox.init(document.querySelectorAll('.materialboxed'));
    M.Tabs.init(document.querySelectorAll('ul.tabs'));
    M.Tooltip.init(document.querySelectorAll('.tooltipped'));
}

export function ISODateString(c) {
    c = new Date(c)
    return c.toISOString() || (c.getUTCFullYear() + "-" + padnumber(c.getUTCMonth() + 1) + "-" + padnumber(c.getUTCDate()) + "T" + padnumber(c.getUTCHours()) + ":" + padnumber(c.getUTCMinutes()) + ":" + padnumber(c.getUTCSeconds()) + "Z")
}

export function ReadableDateString(f) {
    let e = new Date(f);
    let d = e.getFullYear() + "-" + ("0" + (e.getMonth() + 1)).slice(-2) + "-" + ("0" + e.getDate()).slice(-2) + " " + ("0" + e.getHours()).slice(-2) + ":" + ("0" + e.getMinutes()).slice(-2) + ":" + ("0" + e.getSeconds()).slice(-2);
    return d
}

export function Countdown(date, element) {
    let count = function (date) {
        let final, string;
        let then = Date.parse(date) || date;
        let now = new Date(Date.now());
        let seconds = Math.floor((then - now) / 1000);
        if (seconds < 0) {
            string = "L+ ";
            seconds = Math.floor((now - then) / 1000) + 1; // +1 because we want to have one 0 on the countdown
        } else string = "L- ";
        let minutes = Math.floor(seconds / 60);
        let hours = Math.floor(minutes / 60);
        let days = Math.floor(hours / 24);
        let part = padnumber((seconds % 60), 2);
        if (seconds < 60) {
            final = string + part
        }
        part = padnumber((minutes % 60), 2) + ":" + part;
        if (minutes < 60) {
            final = string + part
        }
        part = padnumber((hours % 24), 2) + ":" + part;
        if (hours < 24) {
            final = string + part
        }
        if (days > 1) {
            final = string + days + " days " + part
        } else {
            if (days == 1) {
                final = string + days + " day " + part
            }
        }
        return final
    };
    if (element) {
        let countdown = setInterval(function () {
            (document.getElementById(element) || element).innerHTML = count(date);
        }, 1000);
        countdowns.push(countdown)
    }
    return count(date)
}

export function updateCountdown(launch) {
    load("launch?mode=summary" + (parseInt(launch.id) ? ("&id=" + launch.id) : ("&limit=1&name=" + launch.id)), function (refreshdata) {

        if (refreshdata.status != "error") {
            let newLaunch = refreshdata.launches[0];
            
            if (newLaunch && (newLaunch.net != launch.net)) {

                for (let count of countdowns) {
                    window.clearInterval(count);
                }

                countdown.innerHTML = newLaunch.status;

                if (newLaunch.statuscode == 1 || newLaunch.statuscode == 6) {
                    M.toast({
                        html: "Updated Countdown"
                    });
                    let count = setInterval(function () {
                        document.title = `[${Countdown(newLaunch.net)}] ${newLaunch.name.split("|")[1]}`;
                        countdown.innerHTML = Countdown(newLaunch.net)
                    }, 1000);
                    countdowns.push(count);
                } else if (newLaunch.net != launch.net) {
                    location.reload();
                }
            }
        }
    });
}

export function QueryString(callback, url) {
    let g = {};
    let l = (url && url.split("?")[1]) || (window.location.search || location.hash).substring(1);
    let k = l.split("&");
    for (let m = 0; m < k.length; m++) {
        let j = k[m].split("=");
        if (typeof g[j[0]] === "undefined") {
            g[j[0]] = decodeURIComponent(j[1])
        } else {
            if (typeof g[j[0]] === "string") {
                let h = [g[j[0]], decodeURIComponent(j[1])];
                g[j[0]] = h
            } else {
                g[j[0]].push(decodeURIComponent(j[1]))
            }
        }
    }
    if (callback) callback(g);
    return g
}

export function load(query, callback) {
    getJSON(backendURL + query, function (data) {
        if (callback) callback(data);
        return data;
    });
}

export function getJSON(url, callback) {
    if (window.fetch) {
        fetch(url)
            .then(
                function (response) {
                    if (response.status !== 200) {
                        console.log('Looks like there was a problem. Status Code: ' +
                            response.status);
                        return;
                    }
                    
                    response.json().then(callback);
                }
            )
            .catch(function (err) {
                console.log('Fetch Error :-S', err);
            });
    } else {
        try {
            let k = new XMLHttpRequest()
            k.onreadystatechange = function () {
                if (k.readyState === 4) {
                    if (k.responseText.split()[0] == "{" || k.status == 200) {
                        let a = JSON.parse(k.responseText);
                        a.timestamp = Date.now();
                        callback(a)
                    } else {
                        let a = {
                            timestamp: Date.now(),
                            status: (k.status || "error"),
                            code: k.statusText,
                            msg: k.responseText
                        };
                        callback(a);
                        console.log(a)
                    }
                }
            };
            k.open("GET", url);
            k.send()
        } catch (e) {
            console.log(e)
        }
    }
};

export function restart() {
    navigator.serviceWorker.getRegistrations().then(function (registrations) {
        for (let registration of registrations) {
            console.log(registration)
            registration.unregister()
        }
    });
    localStorage.clear();
    location.reload(true);
}

export function saveValue(e) {
    let key = this.id;
    let value = this.checked;
    let $settings = JSON.parse(localStorage.getItem("rocketwatch.settings"));
    $settings[key] = value;
    localStorage.setItem("rocketwatch.settings", JSON.stringify($settings));
    M.toast({
        html: "Saved! " + key + ": " + value
    });
    console.log(key + ": " + value);
    location.reload(true);
}

function padnumber(number, zeros = 2) {
    let string = number + "";
    while (string.length < zeros) {
        string = "0" + string
    }
    return string
};