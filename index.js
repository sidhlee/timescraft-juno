import { setNextQuestion, getQuestions } from './js/questions.js';
import state, { setState } from './js/state.js';

// import confetti from 'canvas-confetti';

// confetti.create(document.getElementById('canvas'), {
//   resize: true,
//   useWorker: true,
// })({ particleCount: 200, spread: 200 });

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
  $('button').attr('disabled', 'true');
  setTimeout(() => {
    setNextQuestion();
  }, delay);

  setState({
    currentQuestions: updatedCurrentQuestions,
    currentIndex: currentIndex + 1,
  });
}

function handleStartButtonClick() {
  $('#start-btn').addClass('hide');
  $('#next-btn').removeClass('hide');
  // update state with randomized questions
  const questions = getQuestions();
  setState({ currentQuestions: questions });

  setNextQuestion();
}

function handleTryAgainClick() {
  $('#result').addClass('hide');
  $('#main').removeClass('hide').addClass('animate__animated animate__fadeIn');
}

$('#start-btn').on('click', handleStartButtonClick);
$('#next-btn').on('click', setNextQuestion);
$('#answer-buttons').children().on('click', handleAnswerButtonClick);
$('#result button').on('click', handleTryAgainClick);
