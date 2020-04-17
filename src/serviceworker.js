importScripts('https://cdn.onesignal.com/sdks/OneSignalSDKWorker.js');

workbox.core.skipWaiting();
workbox.core.clientsClaim();

workbox.routing.registerRoute(
  new RegExp(/.*/),
  new workbox.strategies.StaleWhileRevalidate()
);

workbox.precaching.precacheAndRoute(self.__precacheManifest);