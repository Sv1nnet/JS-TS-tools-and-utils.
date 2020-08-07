// eslint-disable-next-line import/no-extraneous-dependencies
import { shallow, ShallowWrapper } from 'enzyme';
import React from 'react';
import { act } from 'react-dom/test-utils';

export type TMountedHook<H extends {}> = {
  componentMount: ShallowWrapper,
  componentHook: H,
};

/**
 * 
 * @param {Function} hook React hook
 * @example
 * let setupComponent;
  let hook;
  let makeRequest;

  beforeEach(() => {
    setupComponent = mountReactHook(useRequest); // Mount a Component with our hook
    hook = setupComponent.componentHook; // useRequest return an array, so componentHook is an array
    makeRequest = hook[1];
  });
 */
const mountReactHook = <H extends any>(hook: Function): TMountedHook<H> => {
  const Component = ({ children }) => children(hook());
  let componentHook = {} as H;
  let componentMount: ShallowWrapper;

  act(() => {
    componentMount = shallow(
      <Component>
        {(hookValues) => {
          if (typeof hookValues === 'object') Object.assign(componentHook, hookValues);
          else componentHook = hookValues;
          if (Array.isArray(hookValues)) componentHook[Symbol.iterator] = Array.prototype[Symbol.iterator];
          return null;
        }}
      </Component>,
    );
  });
  return { componentMount, componentHook };
};

export default mountReactHook;
