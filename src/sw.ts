/// <reference lib="webworker" />

import { cacheNames, clientsClaim, skipWaiting } from 'workbox-core';
import { registerRoute, setCatchHandler } from 'workbox-routing';
import { getCacheKeyForURL, precacheAndRoute } from 'workbox-precaching';
import { NetworkFirst } from 'workbox-strategies';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';

skipWaiting();
clientsClaim();

declare let self: ServiceWorkerGlobalScope;
const manifest = self.__WB_MANIFEST;
precacheAndRoute(manifest, {});

registerRoute(
    ({ request }) => request.mode === 'navigate',
    new NetworkFirst({
        cacheName: cacheNames.precache,
        networkTimeoutSeconds: 5,
        plugins: [
            new CacheableResponsePlugin({
                statuses: [200],
            }),
        ],
    }),
);

setCatchHandler(({ request }) => {
    if (typeof request !== 'string' && request.mode === 'navigate') {
        const key = getCacheKeyForURL('/index.html');
        if (key) {
            return caches.match(key) as Promise<Response>;
        }
    }

    // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
    return Promise.reject(Response.error());
});
