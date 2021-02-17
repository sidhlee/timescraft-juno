import { resetPlayState } from './js/state.js';
import {
  startQuiz,
  restartQuiz,
  evaluateAnswer,
  setNextQuestion,
} from './js/quiz.js';
import { showScreen } from './js/view.js';

//=====================================
// Event Handlers
//=====================================

/**
 * Select answer to move to next question if correct
 * @param {number} delay - delay until showing next question
 */
function handleAnswerButtonClick(e) {
  evaluateAnswer(e);
  setNextQuestion();
}

function handleSelectButtonClick() {
  // get selected table from data attribute
  const table = this.dataset.table;
  startQuiz(table);
}

function handleAgainButtonClick() {
  restartQuiz();
}

function handleMainButtonClick() {
  resetPlayState();
  showScreen('start');
}

//=====================================
// Event Bindings
//=====================================

// Start
$('.table-select > button').each(function (i, button) {
  $(button).on('click', handleSelectButtonClick);
});

// Play
$('.answer-buttons').children().on('click', handleAnswerButtonClick);

// Results
$('.btn-again').on('click', handleAgainButtonClick);
$('.btn-main').on('click', handleMainButtonClick);

// TODO: reset state & button disable
// TODO: add start page -> set table or shuffle
// TODO: save result to the localStorage
// TODO: load result from localStorage on mount
// TODO: add stats page
