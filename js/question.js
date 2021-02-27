import State from './state.js';
import Hud from './hud.js';
import Mob from './mob.js';
import { shuffle as _shuffle } from './utils.js';

/**
 * Select questions from table and return them.
 * @param {{length: number, shuffle: boolean, table: number}} param0
 * @returns {{ table: number, by: number, difficulty: number, tried:number, lastTried: Date, lastCorrect: Date }[]}
 */
export function getQuestions(
  { length, shuffle, table } = { length: 9, shuffle: false }
) {
  let questions;
  // convert table into zero-based index for tables array
  const tableIndex = table - 2;

  if (table < 2 || table > 9) {
    throw new Error('invalid table');
  }

  if (table) {
    questions = State.tables[tableIndex];
    State.set({ currentTable: table });
  } else {
    const randomTableIndex = Math.floor(Math.random() * 8);
    questions = State.tables[randomTableIndex];
    State.set({ currentTable: randomTableIndex });
  }

  if (shuffle) {
    questions = _shuffle(questions);
  }

  if (length > 0) {
    questions = questions.slice(0, length);
  }

  return questions;
}

function getRandomQuestions() {
  const allQuestions = State.tables.flat();
  const shuffledQuestions = _shuffle(allQuestions);
  return shuffledQuestions.slice(0, 9);
}

export function showQuestion(question) {
  const { table, by, difficulty } = question;
  const mob = new Mob(difficulty);
  mob.show();

  // animate bubble

  const questionString = `${table} x ${by} = ?`;
  $('.speech-bubble > p')
    .text(questionString)
    .parent('.speech-bubble')
    .one('animationend', function (e) {
      e.stopPropagation();
      $(this).removeClass('animate__animated animate__zoomIn animate__faster');
      // start countdown after question is displayed
      Hud.startTimer();
    })
    .removeClass('hidden')
    .addClass('animate__animated animate__zoomIn animate__faster');
}

const Question = {
  get: getQuestions,
  getRandom: getRandomQuestions,
  show: showQuestion,
};

export default Question;
