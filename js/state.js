// 2, 3, 4, 5, 6, 7, 8, 9
const difficultyArrays = [
  [1, 1, 2, 2, 3, 4, 4, 5], // 2
  [1, 2, 3, 4, 5, 6, 6, 7], // 3
  [2, 3, 3, 3, 4, 5, 6, 7], // 4
  [2, 3, 3, 4, 4, 5, 5, 5], // 5
  [3, 3, 4, 3, 4, 6, 6, 8], // 6
  [3, 4, 5, 5, 7, 7, 8, 9], // 7
  [3, 4, 5, 5, 6, 10, 9, 11], // 8
  [3, 5, 6, 7, 8, 11, 12, 13], // 9
];

const TABLES = getTables(difficultyArrays);

const state = {
  tables: TABLES,
  currentIndex: 0,
  currentTable: 2,
  currentQuestions: TABLES[0],
  life: 1,
  time: 0,
};

export function setState(newState) {
  Object.assign(state, newState);
}

export default state;

/**
 * Returns an array of tables
 * @param {number[][]} difficultyArrays - 2D array of difficulties
 */
function getTables(difficultyArrays, maxTable = 9) {
  const tables = [];
  for (let table = 2; table <= maxTable; table++) {
    const questions = [];
    for (let by = 2; by <= maxTable; by++) {
      const tableIndex = table - 2;
      const byIndex = by - 2;
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
