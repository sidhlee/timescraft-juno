import _shuffle from './shuffle.js';
import { mobs } from './mobs.js';
import state, { setState } from './state.js';
import { goTo } from './view.js';

export function startQuiz() {
  setNextQuestion();
  goTo('play');
}

export function setNextQuestion() {
  if (state.currentIndex >= state.currentQuestions.length) {
    return goTo('results');
  }
  if (state.life <= 0) {
    // TODO: go to results page and show 'died'
    return goTo('gameover');
  }

  console.log('setNextQuestion');
  resetAnswers();
  const { currentQuestions: questions, currentIndex: i } = state;
  showQuestion(questions[i]);
  const answers = getAnswers(questions[i]);
  showAnswers(answers);
  showProgress();
  showLife();

  enableAllButtons();

  console.log(state);
  setState({
    currentIndex: state.currentIndex + 1,
  });
}

function showProgress() {
  $('.hud__progress')
    .children()
    .each((i, div) => {
      if (i <= state.currentIndex) {
        $(div).find('img').attr('src', '/assets/images/exp-full.png');
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

export function showQuestion(question) {
  console.log(question);
  startTimer();
  const { table, by, difficulty } = question;
  const { src } = getMob(difficulty);
  const questionString = `${table} x ${by} = ?`;

  $('.mob > img')
    .attr('src', src)
    .parent()
    .on('animationend', function () {
      $(this).removeClass(
        'animate__animated animate__slideInLeft animate__faster'
      );
      showBubble();
    })
    .addClass('animate__animated animate__slideInLeft animate__faster');

  function showBubble() {
    $('.speech-bubble > p')
      .text(questionString)
      .parent()
      .on('animationend', function () {
        $(this).removeClass(
          'animate__animated animate__zoomIn animate__faster'
        );
      })
      .removeClass('hidden')
      .addClass('animate__animated animate__zoomIn animate__faster');
  }
}

function getMob(difficulty) {
  const mob = mobs.find((mob) => mob.difficulty === difficulty);
  return mob;
}

function startTimer() {
  let time = 9;

  const showAndUpdateTime = () => {
    if (time < 0) {
      failQuestion();
      setNextQuestion();
      return;
    } else {
      $('.hud__time > span').text(time);
      setState({ time: state.time + 1 });
      time--;
      setTimeout(showAndUpdateTime, 1000);
    }
  };

  showAndUpdateTime();
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

export function getAnswers(question, size = 4) {
  console.log('getAnswers');
  const { table, by } = question;
  const correctAnswer = table * by;
  const wrongAnswers = getWrongAnswers(question, size - 1);
  const answers = wrongAnswers.concat({ text: correctAnswer, correct: true });

  return _shuffle(answers);
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

export function getWrongAnswers(answer, size = 3) {
  const wrongAnswers = [2, 3, 4, 5, 6, 7, 8, 9]
    .filter((by) => by !== answer.by)
    .map((by) => ({
      text: answer.table * by,
      correct: false,
    }));

  return _shuffle(wrongAnswers).slice(0, size);
}

export function enableAllButtons() {
  $('button').removeAttr('disabled');
}

const defaultOptions = {
  length: 9,
  shuffle: false,
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
