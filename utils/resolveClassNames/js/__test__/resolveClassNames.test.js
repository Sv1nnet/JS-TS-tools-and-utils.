import { expect, test, describe } from '@jest/globals';
import resolveClassNames from '../resolveClassNames.js';

describe('resolveClassNames.js', () => {
  test('Concats two class names when extra is a string', () => {
    const base = 'base';
    const extra = 'extra';
    const result = 'base extra';
    expect(resolveClassNames(base, extra)).toBe(result);
  });

  test('Concats two class names when extra is a array', () => {
    const base = 'base';
    const extra = ['extra', 'another-extra'];
    const result = 'base extra another-extra';
    expect(resolveClassNames(base, extra)).toBe(result);
  });

  test('Concats two class names', () => {
    const base = 'base';
    expect(resolveClassNames(base, [''])).toBe(base);
  });

  test('Throws an error is extra class is neither a string nor an array', () => {
    const base = 'base';
    try {
      resolveClassNames(base, {});
    } catch (e) {
      expect(e).toBeInstanceOf(TypeError);
      expect(e.message).toBe(`extraClassName is neither a string nor an array: ${{}}`);
    }
  });
});