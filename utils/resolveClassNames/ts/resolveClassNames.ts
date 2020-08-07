const resolveClassName = (baseClassName: string, extraClassName: string | string[]): string => {
  if (extraClassName && typeof extraClassName !== 'string' && !Array.isArray(extraClassName)) throw new TypeError(`extraClassName is neither a string nor an array: ${extraClassName}`);
  return Array.isArray(extraClassName) ? `${baseClassName} ${extraClassName.join(' ')}`.trim() : `${baseClassName} ${extraClassName || ''}`.trim();
}

export default resolveClassName;
