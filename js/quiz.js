import _shuffle from './shuffle.js';
import state, { setState, resetPlayState } from './state.js';
import { mobs } from './mobs.js';
import { goTo } from './router.js';

//=====================================
// Local State
//=====================================

let timeRemaining = 9;
let timer;

//=====================================
// Main
//=====================================

/**
 * @param {number} table table selected to play
 */
export function startQuiz(table) {
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

export function restartQuiz() {
  resetPlayState();
  startQuiz();
}

//=====================================
// Questions
//=====================================

export function setCurrentQuestion() {
  clearTimer();
  timeRemaining = 9;

  showProgress();
  showLife();

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
  console.log('showQuestion');
  const { table, by, difficulty } = question;
  const { src, size } = getMob(difficulty);
  console.log({ src, size });

  const questionString = `${table} x ${by} = ?`;
  // animate mob
  $('.mob > img')
    .attr('src', src)
    .parent('.mob')
    .one('animationend', function (e) {
      e.stopPropagation();
      $(this).removeClass(
        'animate__animated animate__slideInLeft animate__faster'
      );
    })
    .removeClass('mob-sm mob-md mob-lg mob-xl')
    .addClass(`mob-${size}`)
    .addClass('animate__animated animate__slideInLeft animate__faster');

  // animate bubble

  $('.speech-bubble > p')
    .text(questionString)
    .parent('.speech-bubble')
    .one('animationend', function (e) {
      e.stopPropagation();
      $(this).removeClass('animate__animated animate__zoomIn animate__faster');
      startTimer();
    })
    .removeClass('hidden')
    .addClass('animate__animated animate__zoomIn animate__faster');
}

function failQuestion() {
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

function passQuestion() {
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
        .removeClass('btn-success')
        .removeClass('btn-danger')
        .addClass('btn-outline-secondary')
        .removeAttr('correct');
    });
}

export function evaluateAnswer(e) {
  const { currentQuestions, currentIndex } = state;
  const updatedCurrentQuestions = currentQuestions.slice();

  // save selected answer
  updatedCurrentQuestions[currentIndex].lastAnswer = +e.target.textContent;

  // Update lastTried state
  const lastTried = new Date().getTime();
  updatedCurrentQuestions[currentIndex].lastTried = lastTried;

  const correct = $(e.target).attr('correct');
  console.log({ correct });

  if (correct) {
    updatedCurrentQuestions[currentIndex].lastCorrect = lastTried;
    passQuestion();
  } else {
    failQuestion();
  }

  setState({
    currentQuestions: updatedCurrentQuestions,
  });
  console.log(state);
}

//=====================================
// HUD
//=====================================

function showProgress() {
  $('.hud__progress')
    .children()
    .each((i, div) => {
      if (i < state.currentIndex) {
        $(div).find('img').attr('src', '/assets/images/exp-full.png');
      } else {
        $(div).find('img').attr('src', '/assets/images/exp-empty.png');
      }
    });
}

function showLife() {
  $('.hud__life')
    .children()
    .each((i, div) => {
      if (i > state.life - 1) {
        $(div).find('img').attr('src', '/assets/images/heart-gray.png');
      }
    });
}

function startTimer() {
  if (timer !== undefined) return;
  const showAndUpdateTime = () => {
    if (timeRemaining < 0) {
      failQuestion();
      setNextQuestion();
      return;
    } else {
      $('.hud__time > span').text(timeRemaining);
      setState({ clearTime: state.clearTime + 1 });
      timeRemaining--;
      timer = setTimeout(showAndUpdateTime, 1000);
    }
  };

  showAndUpdateTime();
}

function clearTimer() {
  clearTimeout(timer);
  timer = undefined;
}

//=====================================
// Helpers
//=====================================

function getMob(difficulty) {
  const mob = mobs.find((mob) => mob.difficulty === difficulty);
  console.log(mob);
  return mob;
}
