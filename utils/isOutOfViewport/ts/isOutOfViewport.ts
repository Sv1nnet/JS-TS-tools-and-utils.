export class Out {
  public top: boolean;
  public left: boolean;
  public bottom: boolean;
  public right: boolean;
  public any: boolean;
  public all: boolean;

  constructor(elem: HTMLElement) {
    const bounding: DOMRect = elem.getBoundingClientRect();

    this.top = bounding.top < 0;
    this.left = bounding.left < 0;
    this.bottom = bounding.bottom > (window.innerHeight || document.documentElement.clientHeight);
    this.right = bounding.right > (window.innerWidth || document.documentElement.clientWidth);
    this.any = this.top || this.left || this.bottom || this.right;
    this.all = this.top && this.left && this.bottom && this.right;
  }
}

/*!
 * Check if an element is out of the viewport
 * (c) 2018 Chris Ferdinandi, MIT License, https://gomakethings.com
 * @param  {Element}  elem The element to check
 * @return {Object}     A set of booleans for each side of the element
 */
const isOutOfViewport = (elem: HTMLElement): Out => new Out(elem);

export default isOutOfViewport;
