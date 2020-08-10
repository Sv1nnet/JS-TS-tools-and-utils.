// eslint-disable-next-line import/no-extraneous-dependencies
import { shallow } from 'enzyme';
import React from 'react';
import { act } from 'react-dom/test-utils';
import objectIterator from '../../utils/objectIterator/js/objectIterator';

/**
 * 
 * @param {Function} hook React hook
 * @example
 * let setupComponent;
  let hook;
  let makeRequest;

  beforeEach(() => {
    setupComponent = mountReactHook(useRequest); // Mount a Component with our hook
    hook = setupComponent.componentHook;
    makeRequest = hook[1];
  });
 */
export const mountReactHook = (hook) => {
  const Component = ({ children }) => children(hook());
  let componentHook = {};
  let componentMount;

  act(() => {
    componentMount = shallow(
      <Component>
        {(hookValues) => {
          const isArray = Array.isArray(hookValues);

          if (typeof hookValues === 'object' || isArray) Object.assign(componentHook, hookValues);
          else componentHook = hookValues;

          if (isArray) componentHook[Symbol.iterator] = objectIterator;
          return null;
        }}
      </Component>,
    );
  });
  return { componentMount, componentHook };
};

export default mountReactHook;
