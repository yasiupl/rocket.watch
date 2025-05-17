const appBaseUrl = 'https://rocketwatch.space';
importScripts('https://cdn.onesignal.com/sdks/OneSignalSDKWorker.js');

workbox.googleAnalytics.initialize();
workbox.core.skipWaiting();
workbox.core.clientsClaim();

workbox.routing.registerRoute(
  ({url}) => url.origin === 'https://ll.thespacedevs.com',
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'll-api-cache',
    plugins: [
      new workbox.expiration.Plugin({
        maxAgeSeconds: 24 * 60 * 60,
      }),
      new workbox.cacheableResponse.Plugin({
        statuses: [0, 200],
      })
    ]
  })
);


workbox.routing.registerRoute(
  ({url}) => (url.origin === appBaseUrl &&
  url.pathname.startsWith('/assets/')) || (url.origin === 'https://spacelaunchnow-prod-east.nyc3.digitaloceanspaces.com'),
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'assets-cache',
    plugins: [
      new workbox.expiration.Plugin({
        maxAgeSeconds: 7 * 24 * 60 * 60,
      }),
    ],
  })
);
workbox.precaching.precacheAndRoute(self.__WB_MANIFEST);