import _shuffle from './shuffle.js';

export function selectAnswer() {}

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

export function setNextQuestion() {
  const { currentQuestions: questions, currentIndex: i } = state;
  showQuestion(questions[i]);
  setState({ currentIndex: i + 1 });
}

export function showQuestion(question) {
  const questionString = `${question.table} x ${question.by} = ?`;
  $('#question').text(questionString);
  $('#question-container').removeClass('hide');
}

export function getAnswers(question, howMany = 4) {
  const { table, by } = question;
  const correctAnswer = table * by;
  const answers = getWrongAnswers(correctAnswer, howMany - 1);
  answers.concat({ text: correctAnswer, correct: true });
  return answers;
}

export function getWrongAnswers(correctAnswer, howMany = 1) {
  let i = 0;
  const wrongAnswers = [];
  while (i < howMany) {
    const randomNumberFromOneToTen = Math.floor(Math.random() * 10 + 1);
    const oneOrMinusOne = Math.random() > 0.5 ? 1 : -1;
    const wrongAnswer = randomNumberFromOneToTen * oneOrMinusOne;

    if (wrongAnswers.find((n) => n === wrongAnswer)) {
      continue;
    } else {
      wrongAnswers.push(wrongAnswer);
      i++;
    }
  }
  return wrongAnswers;
}
