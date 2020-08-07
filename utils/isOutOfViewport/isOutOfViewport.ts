export type TOut = {
  top: boolean,
  left: boolean,
  bottom: boolean,
  right: boolean,
  any: boolean,
  all: boolean,
};

/*!
 * Check if an element is out of the viewport
 * (c) 2018 Chris Ferdinandi, MIT License, https://gomakethings.com
 * @param  {Element}  elem The element to check
 * @return {Object}     A set of booleans for each side of the element
 */
const isOutOfViewport = function isOutOfViewport(elem: HTMLElement): TOut {
  if (!elem || !(elem instanceof Node)) throw new Error('Passed element in arguments isn\'t an instance of HTMLElement');

  // Get element's bounding
  const bounding: DOMRect = elem.getBoundingClientRect();

  // Check if it's out of the viewport on each side
  const out: TOut = {
    top: bounding.top < 0,
    left: bounding.left < 0,
    bottom: bounding.bottom > (window.innerHeight || document.documentElement.clientHeight),
    right: bounding.right > (window.innerWidth || document.documentElement.clientWidth),
    any: this.top || this.left || this.bottom || this.right,
    all: this.top && this.left && this.bottom && this.right,
  };

  return out;
};

export default isOutOfViewport;
