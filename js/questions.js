import _shuffle from './shuffle.js';
import state, { setState } from './state.js';
import { showResult } from './result.js';

export function setNextQuestion() {
  if (state.currentIndex >= state.currentQuestions.length) {
    return showResult();
  }
  console.log('setNextQuestion');
  resetAnswers();
  const { currentQuestions: questions, currentIndex: i } = state;
  showQuestion(questions[i]);
  const answers = getAnswers(questions[i]);
  showAnswers(answers);
  enableAllButtons();
  console.log(state);
}

const defaultOptions = {
  length: 9,
  shuffle: true,
};

/**
 * Select questions from table and return them.
 * @param {{length: number, shuffle: boolean, table: number}} param0
 * @returns {{ table: number, by: number, difficulty: number, tried:number, lastTried: Date, lastCorrect: Date }[]}
 */
export function getQuestions({ length, shuffle, table } = defaultOptions) {
  let questions;

  if (table < 2 || table > 9) {
    throw new Error('invalid table');
  }

  if (table) {
    questions = state.tables[table];
    setState({ currentTable: table });
  } else {
    const randomTable = Math.floor(Math.random() * 8);
    questions = state.tables[randomTable];
    setState({ currentTable: randomTable });
  }

  if (shuffle) {
    questions = _shuffle(questions);
  }

  if (length > 0) {
    questions = questions.slice(0, length);
  }

  return questions;
}

export function getAnswers(question, size = 4) {
  console.log('getAnswers');
  const { table, by } = question;
  const correctAnswer = table * by;
  const wrongAnswers = getWrongAnswers(question, size - 1);
  const answers = wrongAnswers.concat({ text: correctAnswer, correct: true });

  return _shuffle(answers);
}

export function getWrongAnswers(answer, size = 3) {
  const wrongAnswers = [2, 3, 4, 5, 6, 7, 8, 9]
    .filter((by) => by !== answer.by)
    .map((by) => ({
      text: answer.table * by,
      correct: false,
    }));

  return _shuffle(wrongAnswers).slice(0, size);
}

export function resetAnswers() {
  $('#answer-buttons')
    .children()
    .each((i, btn) => {
      $(btn)
        .removeClass('btn-success')
        .removeClass('btn-danger')
        .addClass('btn-outline-secondary')
        .removeAttr('correct');
    });
}

export function enableAllButtons() {
  $('button').removeAttr('disabled');
}

//=====================================
// Renderers
//=====================================

export function showQuestion(question) {
  console.log(question);
  const questionString = `${question.table} x ${question.by} = ?`;
  $('#question')
    .text(questionString)
    .on('animationend', function () {
      $(this).removeClass(
        'animate__animated animate__fadeInLeft animate__faster'
      );
    })
    .addClass('animate__animated animate__fadeInLeft animate__faster');
  $('#question-container').removeClass('hide');
}

export function showAnswers(answers) {
  $('#answer-buttons')
    .children()
    .each((i, button) => {
      $(button).text(answers[i].text);
      if (answers[i].correct) {
        $(button).attr('correct', true);
      }
    });
}
