export function goTo(to) {
  switch (to) {
    case 'start':
      return goToStart();
    case 'play':
      return goToPlay();
    case 'results':
      return goToResults();
    default:
      goToStart();
  }
}

function goToStart() {
  $('.sc-start').removeClass('hidden');

  $('.menu-btn').addClass('hidden');
  $('.sc-start').addClass('hidden');
  $('.overlay').addClass('hidden');
}

function goToPlay() {
  $('.sc-play').removeClass('hidden');
  $('.menu-btn').removeClass('hidden');

  $('.sc-start').addClass('hidden');
  $('.overlay').addClass('hidden');
}

function goToResults() {
  $('.sc-start').removeClass('hidden');
  $('.menu-btn').removeClass('hidden');
  $('.overlay').removeClass('hidden');

  $('.sc-start').addClass('hidden');
}
