import { setNextQuestion, getQuestions } from './js/questions.js';
import state, { setState } from './js/state.js';

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

function handleStartButtonClick() {
  $('#start-btn').addClass('hidden');
  $('#next-btn').removeClass('hidden');
  // update state with randomized questions
  const questions = getQuestions();
  setState({ currentQuestions: questions });

  setNextQuestion();
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

$('#start-btn').on('click', handleStartButtonClick);
$('#next-btn').on('click', setNextQuestion);
$('#answer-buttons').children().on('click', handleAnswerButtonClick);
$('#result button').on('click', handleTryAgainClick);
