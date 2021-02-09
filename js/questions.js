import _shuffle from './shuffle.js';
import state, { setState, TABLES } from './state.js';

export function setNextQuestion() {
  resetAnswers();
  enableAllButtons();
  const { currentQuestions: questions, currentIndex: i } = state;
  showQuestion(questions[i]);
  const answers = getAnswers(questions[i]);
  showAnswers(answers);
  setState({ currentIndex: i + 1 });
}

const defaultOptions = {
  length: 9,
  shuffle: true,
};
export function getQuestions({ length, shuffle, table } = defaultOptions) {
  let selected;

  if (table < 2 || table > 9) {
    throw new Error('invalid table');
  }

  if (table) {
    selected = TABLES[table];
    setState({ currentTable: table });
  } else {
    const randomTable = Math.floor(Math.random() * 8);
    selected = TABLES[randomTable];
    setState({ currentTable: randomTable });
  }

  if (shuffle) {
    selected = _shuffle(selected);
  }

  if (length > 0) {
    selected = selected.slice(0, length);
  }

  return selected;
}

export function getAnswers(question, size = 4) {
  const { table, by } = question;
  const correctAnswer = table * by;
  const wrongAnswers = getWrongAnswers(question, size - 1);
  const answers = wrongAnswers.concat({ text: correctAnswer, correct: true });

  return _shuffle(answers);
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

export function enableAllButtons() {
  $('button').removeAttr('disabled');
}

//=====================================
// Event Handlers
//=====================================

/**
 * Select answer to move to next question if correct
 * @param {number} delay - delay until showing next question
 */
export function handleAnswerButtonClick(e, delay = 500) {
  const correct = $(this).attr('correct');
  if (correct) {
    $(this).removeClass('btn-outline-secondary').addClass('btn-success');
    // disable all buttons before going to next question
    $('button').attr('disabled', 'true');
    setTimeout(() => {
      setNextQuestion();
    }, delay);
  } else {
    $(this)
      .removeClass('btn-outline-secondary')
      .addClass('btn-danger')
      .attr('disabled', 'true');
  }
}

//=====================================
// Renderers
//=====================================

export function showQuestion(question) {
  const questionString = `${question.table} x ${question.by} = ?`;
  $('#question').text(questionString);
  $('#question-container').removeClass('hide');
}

export function showAnswers(answers) {
  $('#answer-buttons button').each((i, button) => {
    $(button).text(answers[i].text);
    if (answers[i].correct) {
      $(button).attr('correct', true);
    }
    $(button).on('click', handleAnswerButtonClick);
  });
}
