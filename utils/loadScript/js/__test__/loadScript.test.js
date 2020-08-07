import { expect, test, describe } from '@jest/globals';
import loadScript from '../loadScript.js';

describe('loadScript.js', () => {
  test('Mounts script with correct url and id', () => {
    const url = 'http://localhost:8080/assets/js/logOnLoaded.js';
    const id = 'script';
    loadScript(url, { options: { id } });

    const script = document.getElementById(id);
    expect(script.src).toBe(url);
    expect(script).toBeTruthy();
  });
});
