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
  console.log({ lastTried, lastCorrect });
  return lastTried?.getTime() === lastCorrect?.getTime();
}
