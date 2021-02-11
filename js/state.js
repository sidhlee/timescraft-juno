const difficultyArrays = [
  //  2, 3, 4, 5, 6, 7, 8, 9
  [1, 1, 2, 2, 2, 3, 3, 3], // 2
  [1, 1, 2, 3, 3, 4, 4, 4], // 3
  [1, 2, 2, 3, 4, 4, 4, 5], // 4
  [2, 3, 3, 3, 3, 3, 3, 3], // 5
  [2, 3, 3, 2, 2, 4, 4, 5], // 6
  [2, 3, 3, 3, 5, 4, 5, 6], // 7
  [2, 3, 4, 4, 6, 5, 5, 7], // 8
  [3, 3, 3, 3, 6, 7, 7, 7], // 9
];

// export const TABLES = [...Array(9)].map((v, i) => tables[`table${i + 2}`]);
const TABLES = getTables(difficultyArrays);

const state = {
  tables: TABLES,
  currentIndex: 0,
  currentTable: 2,
  currentQuestions: TABLES[0],
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
