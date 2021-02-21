import _shuffle from './shuffle.js';
import state, { setState, resetPlayState } from './state.js';
import { goTo } from './router.js';
import {
  animate,
  markCorrectAnswer,
  flashWarning,
  sleep,
  getMob,
  updateHud,
} from './helpers.js';
import { clearTimer, pauseTimer, resetTimer, startTimer } from './timer.js';

//=====================================
// Main
//=====================================

/**
 * @param {number} table table selected to play
 */
export function startQuiz(table) {
  resetPlayState();

  let questions;
  if (table === undefined) {
    questions = state.currentQuestions;
  } else if (table === 'shuffle') {
    questions = getRandomQuestions();
  } else {
    questions = getQuestions({ table, shuffle: true });
  }
  setState({ currentQuestions: questions });
  setCurrentQuestion();
  goTo('play');
}

//=====================================
// Questions
//=====================================

export function setCurrentQuestion() {
  resetTimer();
  updateHud();

  if (state.currentIndex >= state.currentQuestions.length) {
    return goTo('results');
  }
  if (state.life <= 0) {
    return goTo('gameover');
  }

  resetAnswers();
  const { currentQuestions: questions, currentIndex: i } = state;
  const answers = getAnswers(questions[i]);

  showAnswers(answers);

  showQuestion(questions[i]);
  enableAllAnswers();
}

export function setNextQuestion() {
  setState({
    currentIndex: state.currentIndex + 1,
  });
  setCurrentQuestion();
}

/**
 * Select questions from table and return them.
 * @param {{length: number, shuffle: boolean, table: number}} param0
 * @returns {{ table: number, by: number, difficulty: number, tried:number, lastTried: Date, lastCorrect: Date }[]}
 */
export function getQuestions(
  { length, shuffle, table } = { length: 9, shuffle: false }
) {
  let questions;
  // convert table into zero-based index for tables array
  const tableIndex = table - 2;

  if (table < 2 || table > 9) {
    throw new Error('invalid table');
  }

  if (table) {
    questions = state.tables[tableIndex];
    setState({ currentTable: table });
  } else {
    const randomTableIndex = Math.floor(Math.random() * 8);
    questions = state.tables[randomTableIndex];
    setState({ currentTable: randomTableIndex });
  }

  if (shuffle) {
    questions = _shuffle(questions);
  }

  if (length > 0) {
    questions = questions.slice(0, length);
  }

  return questions;
}

function getRandomQuestions() {
  const allQuestions = state.tables.flat();
  const shuffledQuestions = _shuffle(allQuestions);
  return shuffledQuestions.slice(0, 9);
}

export function showQuestion(question) {
  const { table, by, difficulty } = question;
  const { src, size } = getMob(difficulty);

  const questionString = `${table} x ${by} = ?`;
  // animate mob
  $('.mob > img')
    .attr('src', src)
    .one('load', function () {
      $('.mob')
        .one('animationend', function (e) {
          e.stopPropagation();
          $(this).removeClass(
            'animate__animated animate__slideInLeft animate__faster'
          );
        })
        .css('opacity', 1)
        .removeClass('mob-sm mob-md mob-lg mob-xl')
        .addClass(`mob-${size}`)
        .addClass('animate__animated animate__slideInLeft animate__faster');
    });

  // animate bubble

  $('.speech-bubble > p')
    .text(questionString)
    .parent('.speech-bubble')
    .one('animationend', function (e) {
      e.stopPropagation();
      $(this).removeClass('animate__animated animate__zoomIn animate__faster');
      // start countdown after question is displayed
      startTimer();
    })
    .removeClass('hidden')
    .addClass('animate__animated animate__zoomIn animate__faster');
}

export async function failQuestion(clickedButtonElement) {
  await showFailSequence(clickedButtonElement);
  setFailState();
}

async function passQuestion(clickedButtonElement) {
  await showPassSequence(clickedButtonElement);
  setPassState();
}

function setFailState() {
  const updatedQuestions = state.currentQuestions.slice();
  const question = state.currentQuestions[state.currentIndex];
  updatedQuestions[state.currentIndex] = {
    ...question,
    tried: question.tried + 1,
    lastTried: new Date().getTime(),
  };

  setState({
    currentQuestions: updatedQuestions,
    life: state.life - 1,
  });
}

function setPassState() {
  const updatedQuestions = state.currentQuestions.slice();
  const question = state.currentQuestions[state.currentIndex];
  updatedQuestions[state.currentIndex] = {
    ...question,
    tried: question.tried + 1,
    correct: question.correct + 1,
    lastTried: new Date().getTime(),
    lastCorrect: new Date().getTime(),
  };

  setState({
    currentQuestions: updatedQuestions,
  });
}

async function showFailSequence() {
  markCorrectAnswer();
  flashWarning();
  await animate(
    '.hud__life',
    'animate__animated animate__shakeX animate__fast'
  );
  await sleep(1000);
}

async function showPassSequence(clickedButtonElement) {
  markCorrectAnswer(clickedButtonElement);
  await animate('.mob', 'animate__animated animate__shakeX animate__fast');
  await animate('.mob', 'animate__animated animate__fadeOut animate__faster');
  $('.mob').css('opacity', 0); // keep hiding mob after animation classes are removed
}

//=====================================
// Answers
//=====================================

export function getAnswers(question, size = 4) {
  const { table, by } = question;
  const correctAnswer = table * by;
  const wrongAnswers = getWrongAnswers(question, size - 1);
  const answers = wrongAnswers.concat({ text: correctAnswer, correct: true });

  return _shuffle(answers);
}

export function showAnswers(answers) {
  $('.answer-buttons')
    .children()
    .each((i, button) => {
      $(button).text(answers[i].text);
      if (answers[i].correct) {
        $(button).attr('correct', true);
      }
    });
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

export function enableAllAnswers() {
  $('button').removeAttr('disabled');
}

export function resetAnswers() {
  $('.answer-buttons')
    .children()
    .each((i, btn) => {
      $(btn)
        .removeClass('btn-success btn-danger btn-correct')
        .addClass('btn-outline-secondary')
        .removeAttr('correct');
    });
}

/**
 *
 * @param {object} e click event from an answer button
 */
export async function evaluateAnswer(e) {
  pauseTimer();

  const { currentQuestions, currentIndex } = state;
  const updatedCurrentQuestions = currentQuestions.slice();

  // save selected answer
  updatedCurrentQuestions[currentIndex].lastAnswer = +e.target.textContent;

  // Update lastTried state
  const lastTried = new Date().getTime();
  updatedCurrentQuestions[currentIndex].lastTried = lastTried;

  const correct = $(e.target).attr('correct');

  if (correct) {
    updatedCurrentQuestions[currentIndex].lastCorrect = lastTried;
    await passQuestion(e.target);
  } else {
    await failQuestion(e.target);
  }

  setState({
    currentQuestions: updatedCurrentQuestions,
  });
}
