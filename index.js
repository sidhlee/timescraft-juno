import { setNextQuestion } from './js/questions.js';

// import confetti from 'canvas-confetti';

// confetti.create(document.getElementById('canvas'), {
//   resize: true,
//   useWorker: true,
// })({ particleCount: 200, spread: 200 });

function startGame() {
  $('#start-btn').addClass('hide');
  $('#next-btn').removeClass('hide');
  setNextQuestion();
}

$('#start-btn').on('click', startGame);
$('#next-btn').on('click', setNextQuestion);
