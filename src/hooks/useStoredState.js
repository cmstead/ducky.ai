import { useState } from 'react'

/** @typedef{object|[]} State */
/** @typedef{[?State, (state: State) => void]} StoredStateResult */

function mergeInitialState(
  /** @type{State} */ storedState,
  /** @type{State} */ initialState
) {
  const storedStateIsSafe = typeof storedState === 'object';
  const initialStateIsSafe = typeof initialState === 'object';
  const statesAreMergeSafe = storedStateIsSafe && initialStateIsSafe;

  let /** @type{?State} */ mergedState = null;

  if (statesAreMergeSafe && Array.isArray(storedState) === Array.isArray(initialState)) {
    mergedState = [
      ...initialState,
      ...storedState
    ];
  } else if (statesAreMergeSafe) {
    mergedState = {
      ...initialState,
      ...storedState
    };

  }

  return mergedState
}


export default function useStoredState(
  /** @type{string} */ stateName,
  /** @type{State} */ initialState
) {
  const storedState = localStorage.getItem(stateName)
  const pageStateString = storedState
    ? storedState
    : JSON.stringify(initialState)

  const pageState = mergeInitialState(JSON.parse(pageStateString), initialState)
  const [state, setState] = useState(pageState)

  function setStoredState(newState) {
    localStorage.setItem(stateName, JSON.stringify(newState))
    setState(newState)
  }

  /** @type{StoredStateResult} */
  const result = [state, setStoredState]

  return result;
}