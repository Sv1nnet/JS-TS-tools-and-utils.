// eslint-disable-next-line import/no-extraneous-dependencies
import { shallow } from 'enzyme';
import React from 'react';
import { act } from 'react-dom/test-utils';

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
  const componentHook = {};
  let componentMount;

  act(() => {
    componentMount = shallow(
      <Component>
        {(hookValues) => {
          Object.assign(componentHook, hookValues);
          if (Array.isArray(hookValues)) componentHook[Symbol.iterator] = Array.prototype[Symbol.iterator];
          return null;
        }}
      </Component>,
    );
  });
  return { componentMount, componentHook };
};

export default mountReactHook;
