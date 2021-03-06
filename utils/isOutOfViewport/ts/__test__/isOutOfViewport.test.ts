import { expect, test, describe, jest } from '@jest/globals';
import isOutOfViewport from '../isOutOfViewport';

describe('isOutOfViewport.js', () => {
  test('Element is inside of viewport', () => {
    const elOutOfViewport = document.createElement('div');
    elOutOfViewport.getBoundingClientRect = jest.fn(() => ({
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    }) as DOMRect);
    document.body.appendChild(elOutOfViewport);

    const out = isOutOfViewport(elOutOfViewport);
    expect(out.top).toBeFalsy();
    expect(out.left).toBeFalsy();
    expect(out.right).toBeFalsy();
    expect(out.bottom).toBeFalsy();
    expect(out.any).toBeFalsy();
    expect(out.all).toBeFalsy();
  });

  test('Top is out of viewport', () => {
    const elOutOfViewport = document.createElement('div');
    elOutOfViewport.getBoundingClientRect = jest.fn(() => ({
      top: -1,
      left: 0,
      right: 0,
      bottom: 0,
    }) as DOMRect);
    document.body.appendChild(elOutOfViewport);

    const out = isOutOfViewport(elOutOfViewport);
    expect(out.top).toBeTruthy();
  });

  test('Left is out of viewport', () => {
    const elOutOfViewport = document.createElement('div');
    elOutOfViewport.getBoundingClientRect = jest.fn(() => ({
      top: 0,
      left: -1,
      right: 0,
      bottom: 0,
    }) as DOMRect);
    document.body.appendChild(elOutOfViewport);

    const out = isOutOfViewport(elOutOfViewport);
    expect(out.left).toBeTruthy();
  });

  test('Right is out of viewport', () => {
    const elOutOfViewport = document.createElement('div');
    elOutOfViewport.getBoundingClientRect = jest.fn(() => ({
      top: 0,
      left: 0,
      right: window.innerWidth + 1,
      bottom: 0,
    }) as DOMRect);
    document.body.appendChild(elOutOfViewport);

    const out = isOutOfViewport(elOutOfViewport);
    expect(out.right).toBeTruthy();
  });

  test('Top is out of viewport', () => {
    const elOutOfViewport = document.createElement('div');
    elOutOfViewport.getBoundingClientRect = jest.fn(() => ({
      top: 0,
      left: 0,
      right: 0,
      bottom: window.innerHeight + 1,
    }) as DOMRect);
    document.body.appendChild(elOutOfViewport);

    const out = isOutOfViewport(elOutOfViewport);
    expect(out.bottom).toBeTruthy();
  });

  test('Any is out of viewport', () => {
    const elOutOfViewport = document.createElement('div');
    elOutOfViewport.getBoundingClientRect = jest.fn(() => ({
      top: 0,
      left: 0,
      right: 0,
      bottom: window.innerHeight + 1,
    }) as DOMRect);
    document.body.appendChild(elOutOfViewport);

    const out = isOutOfViewport(elOutOfViewport);
    expect(out.any).toBeTruthy();
  });

  test('All is out of viewport', () => {
    const elOutOfViewport = document.createElement('div');
    elOutOfViewport.getBoundingClientRect = jest.fn(() => ({
      top: -1,
      left: -1,
      right: window.innerWidth + 1,
      bottom: window.innerHeight + 1,
    }) as DOMRect);
    document.body.appendChild(elOutOfViewport);

    const out = isOutOfViewport(elOutOfViewport);
    expect(out.all).toBeTruthy();
  });
});
