import State from './state.js';
import Menu from './menu.js';
import Quiz from './quiz.js';
import { disableAllButtons, loadSound } from './utils.js';
import { goTo } from './router.js';

const App = {
  init() {
    // (pre)load audio files
    const { hitSound } = loadSound();

    //=====================================
    // Event Handlers
    //=====================================

    /**
     * Select answer to move to next question if correct
     * @param {number} delay - delay until showing next question
     */
    async function handleAnswerButtonClick(e) {
      // wait for pass/fail animation sequence to end
      disableAllButtons();
      hitSound.play();
      await Quiz.evaluateAnswer(e.target);
      Quiz.setNextQuestion();
    }

    function handleSelectButtonClick() {
      // get selected table from data attribute
      const table = this.dataset.table;
      Quiz.start(table);
    }

    function handleAgainButtonClick() {
      Quiz.start();
    }

    function handleMainButtonClick() {
      State.resetPlayState();
      goTo('start');
    }

    function handleMenuButtonClick() {
      Menu.open();
    }

    async function handleResetButtonClick() {
      Menu.openConfirmation();
    }

    async function handleConfirmResetButtonClick() {
      State.clearSaved();
      await Menu.showResetMessage();
      State.reset();
      handleMainButtonClick();
    }

    function handleCancelResetButtonClick() {
      $('.menu-main').removeClass('hidden');
      $('.reset-confirm').addClass('hidden');
    }

    //=====================================
    // Event Bindings
    //=====================================

    // Start
    $('.table-select > button').each(function (i, button) {
      $(button).on('click', handleSelectButtonClick);
    });

    // Play
    $('.answer-buttons').children().on('click', handleAnswerButtonClick);

    // Menu
    $('.menu-btn').on('click', handleMenuButtonClick);
    $('.btn-resume').on('click', Menu.close);
    $('.btn-reset').on('click', handleResetButtonClick);

    // Reset confirmation
    $('.btn-confirm-yes').on('click', handleConfirmResetButtonClick);
    $('.btn-confirm-no').on('click', handleCancelResetButtonClick);

    // Results
    $('.btn-again').on('click', handleAgainButtonClick);
    $('.btn-main').on('click', handleMainButtonClick);

    goTo('start');
  },
};

export default App;
