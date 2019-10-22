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

    function d(a) {
        return a < 10 ? "0" + a : a
    }
    return c.toISOString() || (c.getUTCFullYear() + "-" + d(c.getUTCMonth() + 1) + "-" + d(c.getUTCDate()) + "T" + d(c.getUTCHours()) + ":" + d(c.getUTCMinutes()) + ":" + d(c.getUTCSeconds()) + "Z")
}

export function ReadableDateString(f) {
    let e = new Date(f);
    let d = e.getFullYear() + "-" + ("0" + (e.getMonth() + 1)).slice(-2) + "-" + ("0" + e.getDate()).slice(-2) + " " + ("0" + e.getHours()).slice(-2) + ":" + ("0" + e.getMinutes()).slice(-2) + ":" + ("0" + e.getSeconds()).slice(-2);
    return d
}

export function Countdown(c, d) {
    let padnumber = function (f, b) {
        let a = f + "";
        while (a.length < b) {
            a = "0" + a
        }
        return a
    };
    let count = function (u) {
        let r;
        let a = Date.parse(u);
        let q = new Date(Date.now());
        let o = Math.floor((a - q) / 1000);
        let s = "L- ";
        if (o <= 0) {
            s = "L+ ";
            o = Math.floor((q - a) / 1000)
        }
        let t = Math.floor(o / 60);
        let p = Math.floor(t / 60);
        let b = Math.floor(p / 24);
        let v = padnumber((o % 60), 2);
        if (o < 60) {
            r = s + v
        }
        v = padnumber((t % 60), 2) + ":" + v;
        if (t < 60) {
            r = s + v
        }
        v = padnumber((p % 24), 2) + ":" + v;
        if (p < 24) {
            r = s + v
        }
        if (b > 1) {
            r = s + b + " days " + v
        } else {
            if (b == 1) {
                r = s + b + " day " + v
            }
        }
        return r
    };
    if (d) {
        let countdown = setInterval(function () {
            (document.getElementById(d) || d).innerHTML = count(c)
        }, 1000);
        countdowns.push(countdown)
    }
    return count(c)
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
