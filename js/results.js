import state, { saveState, setState } from './state.js';

function getResults(state) {
  const { clearTime, life, currentQuestions, level } = state;
  const correct = life + 3;
  const missed = 5 - life;
  const accuracy = Math.round((correct * 100) / 8);
  const difficulty = currentQuestions.reduce((difficulty, question) => {
    return difficulty + question.difficulty;
  }, 0);
  const total = getGameScore(accuracy, difficulty, clearTime);
  const { scoreToNextLevel, upBy, isUp } = getLevelInfo(total);
  const levelAfterClear = level + upBy;

  return {
    clearTime,
    correct,
    missed,
    accuracy,
    difficulty,
    total,
    nextLevel: scoreToNextLevel,
    levelAfterClear,
    levelUpBy: upBy,
    isUp,
  };
}

function getGameScore(accuracy, difficulty, clearTime) {
  const score = accuracy * 10 + difficulty * 5 - clearTime * 2;
  return score;
}

function getLevelInfo(total) {
  let upBy = 0;
  let remaining = total;
  // You need 1000 score to get to level 2
  if (total < 1000) {
    remaining = 1000 - total;
  } else {
    // TODO: rewrite to make it easier to understand
    let toNext = 1000 * 1.2 ** upBy;
    while (remaining > toNext) {
      remaining = remaining - toNext;
      upBy++;
    }
  }

  const scoreToNextLevel = remaining;
  const isUp = upBy > 0;

  return { scoreToNextLevel, upBy, isUp };
}

/**
 * Render results, update state, save state into localStorage
 */
export function updateResults() {
  const {
    clearTime,
    correct,
    missed,
    accuracy,
    difficulty,
    total,
    nextLevel,
    isUp,
    levelUpBy,
  } = getResults(state);

  // show clear-img in case hidden by levelup message
  $('.clear-img').css('opacity', 1);

  $('.results--score__time span').text(clearTime);
  $('.results--score__correct span').text(correct);
  $('.results--score__missed span').text(missed);
  $('.results--score__accuracy span').text(accuracy);
  $('.results--score__difficulty span').text(difficulty);
  $('.results--score__total span').text(total);
  $('.results--score__next-level span').text(nextLevel);

  setState({
    level: state.level + levelUpBy,
    score: state.score + total,
  });

  saveState();

  return {
    isUp,
  };
}

export function showLevelUpMessage() {
  $('.levelup-img')
    .removeClass('hidden')
    .one('animationend', function () {
      $(this).removeClass(
        'animate__animated animate__zoomInDown animate__delay-1s animate__faster'
      );
      $('.clear-img')
        .one('animationend', function () {
          $(this)
            .removeClass('animate__animated animate__fadeOutUp')
            .css('opacity', 0); // not using 'hidden' because we want the container to keep its height.
        })
        .addClass('animate__animated animate__fadeOutUp');
    })
    .addClass(
      'animate__animated animate__zoomInDown animate__delay-1s animate__faster'
    );
}
