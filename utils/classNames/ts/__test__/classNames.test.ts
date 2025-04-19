import { expect, test, describe } from '@jest/globals';
import { classNames } from './../classNames';

describe('classNames', () => {
  it('with first param only', () => {
    expect(classNames('someClass')).toBe('someClass')
  })

  it('with extra classes', () => {
    expect(classNames('someClass', [ 'extra_1', 'extra_2' ])).toBe('someClass extra_1 extra_2')
  })

  it('with mods', () => {
    expect(classNames('someClass', { hovered: true, enabled: false })).toBe('someClass hovered')
  })

  it('with mods and extra classes', () => {
    expect(
      classNames(
        'someClass',
        { hovered: true, enabled: false },
        [ 'extra_1', 'extra_2' ],
      ),
    ).toBe('someClass hovered extra_1 extra_2')
  })
})
