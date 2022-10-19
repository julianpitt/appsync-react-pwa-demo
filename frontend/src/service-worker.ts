/// <reference lib="webworker" />
/* eslint-disable no-restricted-globals */
import { precacheAndRoute } from 'workbox-precaching';

declare const self: ServiceWorkerGlobalScope;
export {};

precacheAndRoute(self.__WB_MANIFEST);
