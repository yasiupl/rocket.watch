


(function(a, c, f, e, b) {
  f[a] = f[a] || function() {
    (f[a].q = f[a].q || [
      ["time", 0, +new Date()]
    ]).push(arguments)
  };
  b = e.getElementsByTagName(c)[0];
  e = e.createElement(c);
  e.async = 1;
  e.src = "https://s.vidpulse.com/all/vp.js";
  b.parentNode.insertBefore(e, b)
})("vidpulse", "script", window, document);
vidpulse("create", "vp_G2wrV4");




(function(a, c, f, e, b) {
  f[a] = f[a] || function() {
    (f[a].q = f[a].q || [
      ["time", 0, +new Date()]
    ]).push(arguments)
  };
  b = e.getElementsByTagName(c)[0];
  e = e.createElement(c);
  e.async = 1;
  e.src = "https://s.vidpulse.com/all/vp.js";
  b.parentNode.insertBefore(e, b)
})("vidpulse", "script", window, document);
vidpulse("create", "vp_G2wrV4");
//<li><a id="intercom_chat" class="btn-floating blue"><i class="material-icons">chat</i></a></li>
(function(a, c, f, e, b) {
  f[a] = f[a] || {
    app_id: "h2k1lqjl",
    custom_launcher_selector: '#intercom_chat',
    hide_default_launcher: true
  };
  b = e.getElementsByTagName(c)[0];
  e = e.createElement(c);
  e.async = 1;
  e.src = "https://widget.intercom.io/widget/h2k1lqjl";
  b.parentNode.insertBefore(e, b)
})("intercomSettings", "script", window, document);

(function(a, c, f, e, b) {
  b = e.getElementsByTagName(c)[0];
  e = e.createElement(c);
  e.async = 1;
  e.src = "https://www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1";
  b.parentNode.insertBefore(e, b)
})("chromecast", "script", window, document);
//<button class="waves-effect waves-light btn grey darken-4 hoverable grey darken-3" is="google-cast-button" style="width: 90px; display: unset !important;"><i class="material-icons">cast</i></button>

(function(a, c, f, e, b) {
  b = e.getElementsByTagName(c)[0];
  e = e.createElement(c);
  e.async = 1;
  e.src = "https://widget.pushbullet.com/embed.js";
  b.parentNode.insertBefore(e, b);
})("PushBullet", "script", window, document);

(function(a, c, f, e, b) {
  b = e.getElementsByTagName(c)[0];
  e = e.createElement(c);
  e.async = 1;
  e.src = "https://cdn.onesignal.com/sdks/OneSignalSDK.js";
  b.parentNode.insertBefore(e, b)

  OneSignal = f.OneSignal || [];
  OneSignal.push(function() {
      console.log("Initialization");
    OneSignal.init({
      appId: "4504d6ef-7b09-4cbf-88da-0e98634256ec",
      autoRegister: true
    })
  });

  OneSignal.push(function() {
    // If we're on an unsupported browser, do nothing
    if (!OneSignal.isPushNotificationsSupported()) {
      return;
    }
    OneSignal.isPushNotificationsEnabled(function(isEnabled) {
      if (isEnabled) {
        document.getElementById("notifications_subscribe").remove();
      } else {
        document.getElementById("notifications_subscribe").addEventListener('click', function() {
          OneSignal.push(["registerForPushNotifications"]);
          event.preventDefault();
        });
      }
    });
  });

})("OneSignal", "script", window, document);
