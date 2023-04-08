import { expect, it, describe } from 'vitest';
import { insertString } from '../src/utils/utils';

describe('test utility method', () => {
  it('should insert text in string', function () {
    const string = 'this is a string';
    expect(insertString(string, 8, 'also ')).eql('this is also a string');
  });
});
