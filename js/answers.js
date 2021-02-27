import { shuffle as _shuffle } from './utils.js';

/**
 * Returns an array of answer objects.
 * @param {{table: number, by: number }} question multiplication question (table * by = ?)
 * @param {number} size number of the answers to return
 * @returns {{value: number, correct: boolean}[]}
 */
function getAnswers(question, size = 4) {
  const { table, by } = question;
  const correctAnswer = {
    value: table * by,
    correct: true,
  };
  const wrongAnswers = getWrongAnswers(question, size - 1);
  const answers = wrongAnswers.concat(correctAnswer);

  return _shuffle(answers);
}

/**
 * Get wrong answers from the current table.
 * @param {{table: number, by: number }} question
 * @param {number} size number of wrong answers to return
 * @returns {{value: number, correct: boolean}[]}
 */
function getWrongAnswers(question, size = 3) {
  const wrongAnswers = [2, 3, 4, 5, 6, 7, 8, 9]
    .filter((by) => by !== question.by)
    .map((by) => ({
      value: question.table * by,
      correct: false,
    }));

  return _shuffle(wrongAnswers).slice(0, size);
}

function showAnswers(answers) {
  $('.answer-buttons')
    .children()
    .each((i, button) => {
      $(button).text(answers[i].value);
      if (answers[i].correct) {
        $(button).attr('correct', true);
      }
    });
}

function resetAnswers() {
  $('.answer-buttons')
    .children()
    .each((i, btn) => {
      $(btn)
        .removeClass('btn-success btn-danger btn-correct')
        .addClass('btn-outline-secondary')
        .removeAttr('correct');
    });
}

function markCorrectAnswer() {
  $('.answer-buttons')
    .children()
    .filter((_, btn) => {
      return $(btn).attr('correct') === 'true';
    })
    .addClass('btn-correct');
}

const Answers = {
  get: getAnswers,
  show: showAnswers,
  reset: resetAnswers,
  markCorrect: markCorrectAnswer,
};

export default Answers;
