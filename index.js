import App from './js/app.js';

$(function () {
  // PWA worker registration
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('../sw.js').then(() => {
        console.log('Service Worker Registered');
      });
    });
  }

  App.init();
});

//TODO: add stats menu
//TODO: fix sound coming out late on android
