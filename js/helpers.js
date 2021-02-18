export async function animate(querySelector, animationClassName) {
  return new Promise((resolve) => {
    $(querySelector)
      .one('animationend', function () {
        $(this).removeClass(animationClassName);
        resolve();
      })
      .addClass(animationClassName);
  });
}

export function markCorrectAnswer(clickedButtonElement) {
  if (clickedButtonElement) {
    $(clickedButtonElement).addClass('btn-correct');
  } else {
    $('.answer-buttons')
      .children()
      .filter((_, btn) => {
        return $(btn).attr('correct') === 'true';
      })
      .addClass('btn-correct');
  }
}

export function flashWarning() {
  animate('.app', 'flash-warning');
}

export async function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), ms);
  });
}
