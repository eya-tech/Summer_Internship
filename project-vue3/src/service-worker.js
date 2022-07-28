// @ts-nocheck
self.__precacheManifest = [].concat(self.__precacheManifest || []);

workbox.setConfig({
    debug: true,
})

workbox.precaching.precacheAndRoute(self.__precacheManifest,{});


const matchFunction = ({url, request, event}) => {
  let p = url.origin === 'http://35.239.76.129:29979' &&
  url.pathname.startsWith('/image')
  console.log("match", p) 
  return p
};

workbox.routing.registerRoute(
    matchFunction,
    new workbox.strategies.CacheFirst({
      cacheName: 'image-cache',
      plugins: [
        new workbox.cacheableResponse.Plugin({
          statuses:[0,200]
        }),
        new workbox.expiration.Plugin({
          maxEntries: 60,
          maxAgeSeconds: 30 * 24 * 60 * 60
        })
      ]
    })
  )