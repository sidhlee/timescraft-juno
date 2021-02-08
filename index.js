import {
  setState,
  getAnswers,
  getWrongAnswers,
  getQuestions,
  setNextQuestion,
  showQuestion,
} from './js/questions.js';

// import confetti from 'canvas-confetti';

// confetti.create(document.getElementById('canvas'), {
//   resize: true,
//   useWorker: true,
// })({ particleCount: 200, spread: 200 });

function startGame() {
  $('#start-btn').addClass('hide');
  $('#next-btn').removeClass('hide');
  const questions = getQuestions({ table: 2, shuffle: true });
  setState({ currentQuestions: questions });
  setNextQuestion();
}

$('#start-btn').on('click', startGame);
$('#next-btn').on('click', setNextQuestion);

console.log(getWrongAnswers(25, 3));
