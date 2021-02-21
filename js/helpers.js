import { mobs } from './mobs.js';
import { pauseTimer, resumeTimer } from './timer.js';
import state, { setState } from './state.js';
/* global Howl */

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
  $('.overlay-warning')
    .one('animationend', function () {
      $(this).removeClass('flash-warning');
    })
    .addClass('flash-warning');
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

export function getMob(difficulty) {
  const mob = mobs.find((mob) => mob.difficulty === difficulty);

  return mob;
}

function showProgress() {
  $('.hud__progress')
    .children()
    .each((i, div) => {
      if (i < state.currentIndex) {
        $(div).find('img').attr('src', '/assets/images/exp-full.png');
      } else {
        $(div).find('img').attr('src', '/assets/images/exp-empty.png');
      }
    });
}

function showLife() {
  $('.hud__life')
    .children()
    .each((i, div) => {
      if (i > state.life - 1) {
        $(div).find('img').attr('src', '/assets/images/heart-gray.png');
      } else {
        $(div).find('img').attr('src', '/assets/images/heart.png');
      }
    });
}

function showTimer() {
  $('.hud__time > span').text(state.timeRemaining);
}

export function updateHud() {
  showProgress();
  showLife();
  showTimer();
}

export function updateDashboard() {
  $('.dashboard__score > td:last-child').text(state.score);
  $('.dashboard__level > td:last-child').text(state.level);
}

export function openMenu() {
  pauseTimer();
  $('.menu').removeClass('hidden');
  $('.reset-confirm').addClass('hidden');
  $('.reset-message').addClass('hidden');
  $('.menu-btn').addClass('hidden');
  setState({ isMenuOpen: true });
}

export function closeMenu() {
  resumeTimer();
  $('.menu').addClass('hidden');
  $('.menu-btn').removeClass('hidden');
  setState({ isMenuOpen: false });
}

export async function showResetMessage() {
  $('.menu-main').addClass('hidden');
  $('.reset-confirm').addClass('hidden');
  $('.reset-message').removeClass('hidden');
  await sleep(2000);
  $('.reset-message').addClass('hidden');
}

export function openConfirmation() {
  $('.menu-main').addClass('hidden');
  $('.reset-confirm').removeClass('hidden');
}
