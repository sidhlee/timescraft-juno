import * as tables from './questions-data.js';

export const TABLES = [...Array(9)].map((v, i) => tables[`table${i + 2}`]);

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
