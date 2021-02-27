import State from './state.js';
import { updateResults, showLevelUpMessage } from './results.js';
import { enableAllButtons, updateDashboard } from './utils.js';

export function goTo(to) {
  enableAllButtons();
  switch (to) {
    case 'start':
      return goToStart();
    case 'play':
      return goToPlay();
    case 'results':
      return goToResults();
    case 'gameover':
      return goToGameOver();
    default:
      goToStart();
  }
}

function goToStart() {
  $('.menu-btn').addClass('hidden');
  $('.sc-play').addClass('hidden');
  $('.overlay').addClass('hidden');
  $('.menu').addClass('hidden');
  State.load();
  updateDashboard();

  $('.app').addClass('parallax');
  $('.sc-start').removeClass('hidden');
}

function goToPlay() {
  $('.app').removeClass('parallax');

  $('.sc-play').removeClass('hidden')[0];
  $('.menu-btn').removeClass('hidden')[0];

  $('.sc-start').addClass('hidden');
  $('.overlay').addClass('hidden');
  $('.menu').addClass('hidden');
}

function goToResults() {
  $('.app').addClass('parallax');

  $('.levelup-img').addClass('hidden');
  $('.sc-start').addClass('hidden');
  $('.sc-play').addClass('hidden');
  $('.menu-btn').addClass('hidden');
  $('.menu').addClass('hidden');

  const { isUp } = updateResults();

  $('.overlay').removeClass('hidden');

  if (isUp) showLevelUpMessage();
}

function goToGameOver() {
  $('.app').addClass('parallax');

  $('.results--score').addClass('hidden');
  $('.sc-start').addClass('hidden');
  $('.sc-play').addClass('hidden');
  $('.overlay').addClass('danger');
  $('.menu').addClass('hidden');

  $('.menu-btn').removeClass('hidden');
  $('.overlay').removeClass('hidden');
  $('.results--died').removeClass('hidden');
}
