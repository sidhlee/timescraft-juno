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

export function loadSound() {
  // Howl loaded with CDN
  const hitSound = new Howl({
    src: ['/assets/audio/hit.mp3'],
    volume: 0.2,
  });
  const openingMusic = new Howl({
    src: ['/assets/audio/Minecraft.mp3'],
  });
  return { hitSound, openingMusic };
}
