import state, { setState } from './state.js';
import { failQuestion, setNextQuestion } from './quiz.js';

//=====================================
// Local State
//=====================================

let timer;

// TODO: make this easier to understand
export function startTimer() {
  let failed = false;
  if (timer !== undefined) return;
  const timeoutCallback = async () => {
    if (state.timeRemaining < 0 && !state.isMenuOpen) {
      // avoid failing more than once
      if (!failed) {
        await failQuestion();
        failed = true;
      }
      // don't start next question while menu is open
      if (!state.isMenuOpen) {
        setNextQuestion();
        return;
      } else {
        // check again in 1 second if menu is open
        timer = setTimeout(timeoutCallback, 1000);
        return;
      }
    } // callback in 1 sec if menu is open and time is up
    else if (state.timeRemaining < 0 && state.isMenuOpen) {
      timer = setTimeout(timeoutCallback, 1000);
      return;
    } else {
      // if still counting
      $('.hud__time > span').text(state.timeRemaining);
      setState({
        clearTime: state.clearTime + 1,
        timeRemaining: state.timeRemaining - 1,
      });

      timer = setTimeout(timeoutCallback, 1000);
      return;
    }
  };

  timeoutCallback();
}

export function clearTimer() {
  clearTimeout(timer);
  timer = undefined;
}

export function resetTimer() {
  clearTimer();
  setState({
    timeRemaining: 9,
  });
}

export function pauseTimer() {
  clearTimer();
}

export function resumeTimer() {
  startTimer();
}
