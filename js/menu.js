import State from './state.js';
import { sleep } from './utils.js';
import Hud from './hud.js';

// Because Safari 💩 doesn't support class static field,
// we end up with this weird static "object".
const Menu = {
  $menu: $('.menu'),
  $mainMenu: $('.menu-main'),
  $resetConfirm: $('.reset-confirm'),
  $resetMessage: $('.reset-message'),
  $menuButton: $('.menu-btn'),
  open() {
    Hud.pauseTimer();
    Menu.$menu.removeClass('hidden');
    Menu.$mainMenu.removeClass('hidden');
    Menu.$resetConfirm.addClass('hidden');
    Menu.$resetMessage.addClass('hidden');
    Menu.$menuButton.addClass('hidden');
    State.set({ isMenuOpen: true });
  },
  close() {
    Hud.resumeTimer();
    Menu.$menu.addClass('hidden');
    Menu.$menuButton.removeClass('hidden');
    State.set({ isMenuOpen: false });
  },
  async showResetMessage() {
    Menu.$mainMenu.addClass('hidden');
    Menu.$resetConfirm.addClass('hidden');
    Menu.$resetMessage.removeClass('hidden');
    await sleep(2000);
    Menu.$resetMessage.addClass('hidden');
  },
  openConfirmation() {
    console.log('openConfirmation');
    Menu.$mainMenu.addClass('hidden');
    Menu.$resetConfirm.removeClass('hidden');
  },
};

export default Menu;
