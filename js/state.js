// 2, 3, 4, 5, 6, 7, 8, 9
const difficultyArrays = [
  [1, 2, 2, 3, 4, 5, 6, 7], // 2
  [1, 2, 4, 5, 7, 12, 11, 13], // 3
  [2, 5, 7, 6, 11, 12, 13, 14], // 4
  [3, 4, 5, 7, 6, 9, 8, 10], // 5
  [4, 5, 8, 7, 8, 9, 12, 18], // 6
  [9, 11, 12, 13, 10, 15, 16, 17], // 7
  [6, 11, 12, 13, 14, 17, 18, 19], // 8
  [15, 19, 20, 21, 22, 25, 24, 23], // 9
];

const TABLES = getTables(difficultyArrays);

const initialState = {
  tables: TABLES,
  currentIndex: 0,
  currentTable: 2,
  currentQuestions: TABLES[0],
  life: 5,
  clearTime: 0,
  remainingTime: 9,
  score: 0,
  level: 1,
  isMenuOpen: false,
};

const state = {
  ...initialState,
};

/**
 * Returns an array of tables (= array of questions)
 * @param {number[][]} difficultyArrays - 2D array of difficulties
 */
function getTables(difficultyArrays, maxTable = 9) {
  const tables = [];
  for (let table = 2; table <= maxTable; table++) {
    const questions = [];
    for (let by = 2; by <= maxTable; by++) {
      const tableIndex = table - 2;
      const byIndex = by - 2;
      // question schema
      const question = {
        table,
        by,
        difficulty: difficultyArrays[tableIndex][byIndex],
        tried: 0,
        correct: 0,
        lastTried: null, // use Date.getTime()
        lastCorrect: null,
      };

      questions.push(question);
    }

    tables.push(questions);
  }

  return tables;
}

const savedStates = ['tables', 'score', 'level'];

const State = {
  /** get current state */
  get() {
    return state;
  },
  get currentIndex() {
    return state.currentIndex;
  },
  get life() {
    return state.life;
  },
  get remainingTime() {
    return state.remainingTime;
  },
  get isMenuOpen() {
    return state.isMenuOpen;
  },
  get clearTime() {
    return state.clearTime;
  },
  get currentQuestions() {
    return state.currentQuestions;
  },
  get tables() {
    return state.tables;
  },
  get level() {
    return state.level;
  },
  get score() {
    return state.score;
  },
  /** set new state */
  set(newState) {
    Object.assign(state, newState);
  },
  /** load state from local Storage*/
  load() {
    savedStates.forEach((s) => {
      const dataString = window.localStorage.getItem(s);
      if (dataString) {
        State.set({ [s]: JSON.parse(dataString) });
      }
    });
  },
  /** save state into local storage */
  save() {
    savedStates.forEach((s) => {
      const dataString = JSON.stringify(State[s]);
      window.localStorage.setItem(s, dataString);
    });
  },
  /** clear state data saved in localStorage */
  clearSaved() {
    savedStates.forEach((s) => {
      window.localStorage.removeItem(s);
    });
  },
  /** Reset state to initial state. */
  reset() {
    State.set({ ...initialState });
  },
  resetPlayState() {
    State.set({
      life: 5,
      clearTime: 0,
      currentIndex: 0,
      remainingTime: 9,
      isMenuOpen: false,
    });
  },
};

export default State;
