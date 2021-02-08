import { getWrongAnswers } from '../js/questions';

it('should work', () => {
  expect(1).toBe(1);
});

describe('getWrongAnswers', () => {
  it('should get correct number of answers', () => {
    expect(getWrongAnswers(4, 3).length).toBe(3);
  });
});
