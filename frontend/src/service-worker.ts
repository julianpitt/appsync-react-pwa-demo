/// <reference lib="webworker" />
/* eslint-disable no-restricted-globals */
// import { precacheAndRoute } from 'workbox-precaching';

declare const self: ServiceWorkerGlobalScope;
export {};

// precacheAndRoute(self.__WB_MANIFEST);

self.addEventListener('push', function (event) {
  if (event.data) {
    const data = JSON.parse(event.data.text());
    const options = {
      body: data.content,
      icon: data.icon,
      data: {
        // can be anything
        url: data.openUrl,
      },
    };

    // wait until we show the notification first
    // the active service worker cant show the notification
    // self.registration is the part that connects the sw to the browser
    event.waitUntil(self.registration.showNotification(data.title, options));
  }
});
