import { setNextQuestion, getQuestions } from './js/quiz.js';
import state, { setState, resetPlayState } from './js/state.js';
import { startQuiz, restartQuiz } from './js/quiz.js';
import { showScreen } from './js/view.js';

//=====================================
// Event Handlers
//=====================================

/**
 * Select answer to move to next question if correct
 * @param {number} delay - delay until showing next question
 */
export function handleAnswerButtonClick(e, delay = 500) {
  const { currentQuestions, currentIndex } = state;
  const updatedCurrentQuestions = currentQuestions.slice();

  // save selected answer
  updatedCurrentQuestions[currentIndex].lastAnswer = +e.target.textContent;

  //TODO: store ISOString in state. parse them as needed
  // Update lastTried state
  const lastTried = new Date();
  updatedCurrentQuestions[currentIndex].lastTried = lastTried;

  const correct = $(this).attr('correct');

  if (correct) {
    updatedCurrentQuestions[currentIndex].lastCorrect = lastTried;
    $(this).removeClass('btn-outline-secondary').addClass('btn-success');
  } else {
    $(this).removeClass('btn-outline-secondary').addClass('btn-danger');
  }

  // disable all buttons before going to next question
  $('#answer-buttons > button').add('#next-btn').attr('disabled', 'true');
  setTimeout(() => {
    setNextQuestion();
  }, delay);

  setState({
    currentQuestions: updatedCurrentQuestions,
    currentIndex: currentIndex + 1,
  });
}

function handleSelectButtonClick() {
  const table = this.dataset.table;

  startQuiz(table);
}

function handleTryAgainClick() {
  $('#result').addClass('hidden');
  $('#main')
    .removeClass('hidden')
    .addClass('animate__animated animate__fadeIn');
  // TODO: reset state & button disable
  // TODO: add start page -> set table or shuffle
  // TODO: save result to the localStorage
  // TODO: load result from localStorage on mount
  // TODO: add stats page
}

function handleAgainButtonClick() {
  restartQuiz();
}

function handleMainButtonClick() {
  resetPlayState();
  showScreen('start');
}

//=====================================
// Add event listeners
//=====================================

$('.table-select > button').each(function (i, button) {
  $(button).on('click', handleSelectButtonClick);
});

$('.btn-again').on('click', handleAgainButtonClick);
$('.btn-main').on('click', handleMainButtonClick);
