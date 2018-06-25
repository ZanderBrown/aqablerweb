const version = "test";
const cacheName = `aqabler-${version}`;

self.addEventListener('install', e => {
	e.waitUntil(
		caches.open(cacheName).then(cache => {
			return cache.addAll([
				`index.html`,
				`style.css`,
				`index.js`,
				`0.index.js`,
				`logo.svg`,
				`aqabler.wasm`
			]).catch(e => console.log(e))
				.then(() => self.skipWaiting());
		})
	);
});

self.addEventListener('fetch', event => {
	event.respondWith(
		caches.open(cacheName)
			.then(cache => cache.match(event.request, { ignoreSearch: true }))
			.then(response => {
				return response || fetch(event.request);
			})
	);
});