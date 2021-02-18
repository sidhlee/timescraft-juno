import state from './state.js';
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

  $('.dashboard__score > td:last-child').text(state.score);
  $('.dashboard__level > td:last-child').text(state.level);

  $('.sc-start').removeClass('hidden');
}

function goToPlay() {
  $('.sc-play').removeClass('hidden');
  $('.menu-btn').removeClass('hidden');

  $('.sc-start').addClass('hidden');
  $('.overlay').addClass('hidden');
}

function goToResults() {
  $('.sc-start').addClass('hidden');
  $('.sc-play').addClass('hidden');

  const { isUp } = updateResults();

  $('.menu-btn').removeClass('hidden');
  $('.overlay').removeClass('hidden');

  if (isUp) showLevelUpMessage();
}

function goToGameOver() {
  $('.overlay').addClass('danger');
  $('.results--score').addClass('hidden');

  $('.results--died').removeClass('hidden');

  goToResults();
}
