import State from './state.js';
/* global Howl */

export async function animate(querySelector, animationClassName) {
  return new Promise((resolve) => {
    $(querySelector)
      .one('animationend', function () {
        $(this).removeClass(animationClassName);
        resolve();
      })
      .addClass(animationClassName);
  });
}

export async function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), ms);
  });
}

export function loadSound() {
  // Howl loaded with CDN
  const hitSound = new Howl({
    src: ['./assets/audio/hit.mp3', './assets/audio/hit.webm'],
    volume: 0.2,
  });
  const openingMusic = new Howl({
    src: ['./assets/audio/Minecraft.mp3'],
  });
  return { hitSound, openingMusic };
}

export function updateDashboard() {
  const { score, level } = State.get();

  $('.dashboard__score > td:last-child').text(score);
  $('.dashboard__level > td:last-child').text(level);
}

export function enableAllButtons() {
  $('button').css('pointer-events', 'auto');
}

export function disableAllButtons() {
  $('button').css('pointer-events', 'none');
}

// https://stackoverflow.com/a/2450976/13036807
export function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}
