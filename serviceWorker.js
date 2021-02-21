const timesCraft = 'timeCraft-v1';
const assets = [
  '/',
  '/index.html',
  '/css/index.css',
  '/css/animate.css',
  '/index.js',
  '/assets/audio/hit.mp3',
  '/assets/images/bg.png',
];

self.addEventListener('install', (installEvent) => {
  installEvent.waitUntil(
    caches.open(timesCraft).then((cache) => {
      cache.addAll(assets);
    })
  );
});
