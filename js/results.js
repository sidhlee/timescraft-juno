import state from './state.js';

export function showResult() {
  const score = getScore();
  const details = getResultDetails();

  $('.result__score > span').text(score);
  $('.result__details').append(details);

  $('#main').addClass('hidden');
  $('#result')
    .removeClass('hidden')
    .addClass('animate__animated animate__fadeIn');
}

/**
 * Returns an array of <li> elements with results
 */
function getResultDetails() {
  const details = state.currentQuestions.map((question) => {
    const { table, by, lastAnswer } = question;
    const correct = wasCorrect(question);
    const classes = `list-group-item ${
      correct ? 'list-group-item-success' : 'list-group-item-danger'
    }`;

    let text;
    if (correct) {
      text = `${table} x ${by} = ${lastAnswer} ${'   '}✅`;
    } else {
      text = `${table} x ${by} = ${lastAnswer} ${'   '} ❌  (correct: ${
        table * by
      })`;
    }

    return `<li class="${classes}">
          ${text} 
       </li>`;
  });

  return details;
}

function getScore() {
  const score = state.currentQuestions.reduce((score, question) => {
    return score + question.difficulty * 100;
  }, 0);
  const totalCorrect = state.currentQuestions.reduce((total, question) => {
    return total + (question.lastCorrect ? 1 : 0);
  }, 0);

  const accuracy = Math.round(
    (totalCorrect / state.currentQuestions.length) * 100
  );

  const scoreText = `${score} (${accuracy}%)`;

  return scoreText;
}

function wasCorrect(question) {
  const { lastTried, lastCorrect } = question;

  return lastTried?.getTime() === lastCorrect?.getTime();
}

function getResults(state) {
  const { clearTime, life, currentQuestions, score, level } = state;
  const correct = life + 3;
  const missed = 5 - life;
  const accuracy = Math.round((correct * 100) / 8);
  const difficulty = currentQuestions.reduce((difficulty, question) => {
    return difficulty + question.difficulty;
  }, 0);
  const setScore = accuracy * 20 + difficulty * 10 - clearTime * 5;
  const total = score + setScore;
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
      console.log(remaining);
      upBy++;
    }
  }

  const scoreToNextLevel = remaining;
  const isUp = upBy > 0;

  return { scoreToNextLevel, upBy, isUp };
}

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

  return {
    isUp,
  };
}

export function showLevelUpMessage() {
  $('.levelup-img')
    .removeClass('hidden')
    .one('animationend', function () {
      $(this).removeClass(
        'animate__animated animate__zoomInUp animate__delay-1s animate__faster'
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
