import State from './state.js';
import Quiz from './quiz.js';

const $progress = $('.hud__progress');
const $life = $('.hud__life');
const $timeSpan = $('.hud__time > span');

function showProgress() {
  $progress.children().each((i, div) => {
    if (i < State.currentIndex) {
      $(div).find('img').attr('src', './assets/images/exp-full.png');
    } else {
      $(div).find('img').attr('src', './assets/images/exp-empty.png');
    }
  });
}

function showLife() {
  $life.children().each((i, div) => {
    if (i > State.life - 1) {
      $(div).find('img').attr('src', './assets/images/heart-gray.png');
    } else {
      $(div).find('img').attr('src', './assets/images/heart.png');
    }
  });
}

function showTimer() {
  $timeSpan.text(State.remainingTime);
}

let timer;

// TODO: make this easier to understand
function startTimer() {
  let failed = false;
  if (timer !== undefined) return;
  const timeoutCallback = async () => {
    if (State.remainingTime < 0 && !State.isMenuOpen) {
      // avoid failing more than once
      if (!failed) {
        await Quiz.failQuestion();
        failed = true;
      }
      // don't start next question while menu is open
      if (!State.isMenuOpen) {
        Quiz.setNextQuestion();
        return;
      } else {
        // check again in 1 second if menu is open
        timer = setTimeout(timeoutCallback, 1000);
        return;
      }
    } // callback in 1 sec if menu is open and time is up
    else if (State.remainingTime < 0 && State.isMenuOpen) {
      timer = setTimeout(timeoutCallback, 1000);
      return;
    } else {
      // if still counting
      $('.hud__time > span').text(State.remainingTime);
      State.set({
        clearTime: State.clearTime + 1,
        remainingTime: State.remainingTime - 1,
      });

      timer = setTimeout(timeoutCallback, 1000);
      return;
    }
  };

  timeoutCallback();
}

function clearTimer() {
  clearTimeout(timer);
  timer = undefined;
}

function resetTimer() {
  clearTimer();
  State.set({
    remainingTime: 9,
  });
}

function pauseTimer() {
  clearTimer();
}

function resumeTimer() {
  startTimer();
}

const Hud = {
  update() {
    showProgress();
    showLife();
    showTimer();
  },
  startTimer,
  clearTimer,
  resetTimer,
  pauseTimer,
  resumeTimer,
};

export default Hud;
