import { useState } from 'react';
import localstorage from '../services/localstorage.js';

/** @typedef{object|[]} State */
/** @typedef{[?State, (state: State) => void]} StoredStateResult */

function mergeInitialState(
  /** @type{State} */ storedState,
  /** @type{State} */ initialState
) {
  const storedStateIsSafe = !!storedState && typeof storedState === 'object';
  const initialStateIsSafe = !!initialState && typeof initialState === 'object';

  const storedStateIsArray = Array.isArray(storedState);
  const initialStateIsArray = Array.isArray(initialState);

  const statesAreMergeSafe = storedStateIsSafe && initialStateIsSafe;

  if (statesAreMergeSafe && storedStateIsArray && initialStateIsArray) {
    return [
      ...initialState,
      ...storedState
    ];
  } else if (statesAreMergeSafe) {
    return {
      ...initialState,
      ...storedState
    };
  }

  return initialState;
}

function parseStoredState(storedState) {
  if (typeof storedState === 'string') {
    try {
      return JSON.parse(storedState);
    } catch (e) {
      console.error('Failed to parse stored state:', e);
      return null;
    }
  }

  return storedState;
}

export default function useStoredState(
  /** @type{string} */ stateName,
  /** @type{State} */ initialState
) {
  const storedState = parseStoredState(localstorage.getItem(stateName));
  const pageState = mergeInitialState(storedState, initialState);
  const [state, setState] = useState(pageState);

  function setStoredState(newState) {
    localstorage.setItem(stateName, JSON.stringify(newState));
    setState(newState);
  }

  /** @type{StoredStateResult} */
  return [state, setStoredState];
}