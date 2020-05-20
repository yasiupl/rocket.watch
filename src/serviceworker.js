importScripts('https://cdn.onesignal.com/sdks/OneSignalSDKWorker.js');


workbox.googleAnalytics.initialize();
workbox.core.skipWaiting();
workbox.core.clientsClaim();


workbox.routing.registerRoute(
  new RegExp(/.*/),
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'rocketwatch-cache',
    plugins: [
      new workbox.expiration.Plugin({
        maxAgeSeconds: 24 * 60 * 60,
      }),
    ],
  })
);
workbox.precaching.precacheAndRoute(self.__precacheManifest);