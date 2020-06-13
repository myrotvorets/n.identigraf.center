/// <reference lib="webworker" />

import { cacheNames, clientsClaim, skipWaiting } from 'workbox-core';
import { registerRoute, setCatchHandler } from 'workbox-routing';
import { getCacheKeyForURL, precacheAndRoute } from 'workbox-precaching';
import { NetworkFirst } from 'workbox-strategies';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';

skipWaiting();
clientsClaim();

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

declare let self: ServiceWorkerGlobalScope;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const manifest = [].concat((self as any).__WB_MANIFEST || []);
precacheAndRoute(manifest, {});

setCatchHandler(({ request }) => {
    if (typeof request !== 'string' && request.mode === 'navigate') {
        const key = getCacheKeyForURL('/index.html');
        if (key) {
            return caches.match(key) as Promise<Response>;
        }
    }

    return Promise.reject(Response.error());
});
