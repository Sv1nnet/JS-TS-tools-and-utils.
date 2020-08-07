/**
 * @param {String} baseClassName
 * @param {String|String[]} extraClassName
 */
const resolveClassName = (baseClassName, extraClassName) => {
  if (extraClassName && typeof extraClassName !== 'string' && !Array.isArray(extraClassName)) throw new TypeError(`extraClassName is neither a string nor an array: ${extraClassName}`);
  return Array.isArray(extraClassName) ? `${baseClassName} ${extraClassName.join(' ')}`.trim() : `${baseClassName} ${extraClassName || ''}`.trim();
}

export default resolveClassName;
