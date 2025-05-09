import useUndoableState from '../useUndoableState';
import localstorage from "../../services/localstorage.js";
import { useState } from "react";

jest.mock('../../services/localstorage', () => ({
    getItem: jest.fn(),
    setItem: jest.fn(),
}));

jest.mock('react', () => ({
    useState: jest.fn(),
}));

describe('useUndoableState', () => {

    it('returns the initial state', () => {
        useState.mockImplementation((initialState) => ([initialState, () => null]));

        const initialState = { count: 0 };

        const [state] = useUndoableState('test', initialState);

        expect(state).toEqual(initialState);
    });

    it('calls localstorage.setItem with the correct arguments on update call', () => {
        useState.mockImplementation((initialState) => ([initialState, () => null]));

        const initialState = { count: 0 };
        const newState = { count: 1 };

        const [_, update] = useUndoableState('test', initialState);

        update(newState);

        expect(localstorage.setItem).toHaveBeenCalledWith('test', JSON.stringify(newState));
    });
});