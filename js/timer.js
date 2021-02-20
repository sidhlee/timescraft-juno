import state, { setState } from './state.js';
import { failQuestion, setNextQuestion } from './quiz.js';

//=====================================
// Local State
//=====================================

let timer;

export function startTimer() {
  if (timer !== undefined) return;
  const showAndUpdateTime = async () => {
    if (state.timeRemaining < 0) {
      await failQuestion();
      setNextQuestion();
      return;
    } else {
      $('.hud__time > span').text(state.timeRemaining);
      setState({
        clearTime: state.clearTime + 1,
        timeRemaining: state.timeRemaining - 1,
      });

      timer = setTimeout(showAndUpdateTime, 1000);
    }
  };

  showAndUpdateTime();
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
