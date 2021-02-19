import state, { loadState } from './state.js';
import { updateResults, showLevelUpMessage } from './results.js';

export function goTo(to) {
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

  loadState();

  $('.dashboard__score > td:last-child').text(state.score);
  $('.dashboard__level > td:last-child').text(state.level);

  $('.app').addClass('parallax');
  $('.sc-start').removeClass('hidden');
}

function goToPlay() {
  $('.app').removeClass('parallax');

  $('.sc-play').removeClass('hidden');
  $('.menu-btn').removeClass('hidden');

  $('.sc-start').addClass('hidden');
  $('.overlay').addClass('hidden');
}

function goToResults() {
  $('.app').addClass('parallax');

  $('.sc-start').addClass('hidden');
  $('.sc-play').addClass('hidden');

  const { isUp } = updateResults();

  $('.menu-btn').removeClass('hidden');
  $('.overlay').removeClass('hidden');

  if (isUp) showLevelUpMessage();
}

function goToGameOver() {
  $('.app').addClass('parallax');

  $('.results--score').addClass('hidden');
  $('.sc-start').addClass('hidden');
  $('.sc-play').addClass('hidden');
  $('.overlay').addClass('danger');

  $('.menu-btn').removeClass('hidden');
  $('.overlay').removeClass('hidden');
  $('.results--died').removeClass('hidden');
}
