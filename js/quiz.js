import State from './state.js';
import Hud from './hud.js';
import Question from './question.js';
import Answers from './answers.js';
import { goTo } from './router.js';
import { animate, sleep, enableAllButtons } from './utils.js';

/**
 * @param {number} table table selected to play
 */
function startQuiz(table) {
  State.resetPlayState();

  let questions;
  if (table === undefined) {
    questions = State.currentQuestions;
  } else if (table === 'shuffle') {
    questions = Question.getRandom();
  } else {
    questions = Question.get({ table, shuffle: true });
  }
  State.set({ currentQuestions: questions });
  setCurrentQuestion();
  goTo('play');
}

function setCurrentQuestion() {
  Hud.resetTimer();
  Hud.update();

  if (State.currentIndex >= State.currentQuestions.length && State.life > 0) {
    return goTo('results');
  }
  if (State.life <= 0) {
    return goTo('gameover');
  }

  Answers.reset();
  const { currentQuestions: questions, currentIndex: i } = State.get();
  const answers = Answers.get(questions[i]);

  Answers.show(answers);
  enableAllButtons();

  Question.show(questions[i]);
}

function setNextQuestion() {
  State.set({
    currentIndex: State.currentIndex + 1,
  });
  setCurrentQuestion();
}

async function failQuestion() {
  await showFailSequence();
  setFailState();
}

async function passQuestion() {
  await showPassSequence();
  setPassState();
}

function setFailState() {
  const { currentQuestions, currentIndex, life } = State.get();
  const updatedQuestions = currentQuestions.slice();
  const currentQuestion = currentQuestions[currentIndex];
  updatedQuestions[currentIndex] = {
    ...currentQuestion,
    tried: currentQuestion.tried + 1,
    lastTried: new Date().getTime(),
  };

  State.set({
    currentQuestions: updatedQuestions,
    life: life - 1,
  });
}

function setPassState() {
  const { currentQuestions, currentIndex } = State.get();
  const updatedQuestions = currentQuestions.slice();
  const question = currentQuestions[currentIndex];
  updatedQuestions[currentIndex] = {
    ...question,
    tried: question.tried + 1,
    correct: question.correct + 1,
    lastTried: new Date().getTime(),
    lastCorrect: new Date().getTime(),
  };

  State.set({
    currentQuestions: updatedQuestions,
  });
}

async function showFailSequence() {
  Answers.markCorrect();
  flashWarning();
  await animate(
    '.hud__life',
    'animate__animated animate__shakeX animate__fast'
  );
  await sleep(1000);
}

async function showPassSequence() {
  Answers.markCorrect();
  await animate('.mob', 'animate__animated animate__shakeX animate__fast');
  await animate('.mob', 'animate__animated animate__fadeOut animate__faster');
  $('.mob').css('opacity', 0); // keep hiding mob after animation classes are removed
}

/**
 *
 * @param {object} e click event from an answer button
 */
async function evaluateAnswer(clickedButtonElem) {
  Hud.pauseTimer();
  const { currentQuestions, currentIndex } = State.get();
  const updatedCurrentQuestions = currentQuestions.slice();

  // save selected answer
  updatedCurrentQuestions[
    currentIndex
  ].lastAnswer = +clickedButtonElem.textContent;

  // Update lastTried state
  const lastTried = new Date().getTime();
  updatedCurrentQuestions[currentIndex].lastTried = lastTried;

  const correct = $(clickedButtonElem).attr('correct');

  if (correct) {
    updatedCurrentQuestions[currentIndex].lastCorrect = lastTried;
    await passQuestion();
  } else {
    await failQuestion();
  }

  State.set({
    currentQuestions: updatedCurrentQuestions,
  });
}

function flashWarning() {
  $('.overlay-warning')
    .one('animationend', function () {
      $(this).removeClass('flash-warning');
    })
    .addClass('flash-warning');
}

const Quiz = {
  start: startQuiz,
  setCurrentQuestion,
  setNextQuestion,
  evaluateAnswer,
  failQuestion,
};

export default Quiz;
