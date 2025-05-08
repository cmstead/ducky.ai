import useStoredState from "../useStoredState";
import localstorage from "../../services/localstorage.js";
import { useState } from "react";

jest.mock('../../services/localstorage', () => ({
    getItem: jest.fn(),
    setItem: jest.fn(),
}));

jest.mock('react', () => ({
    useState: jest.fn(),
}));

describe('useStoredState', () => {
    it('initializes state when there is no stored value', () => {
        useState.mockImplementation((initialState) => ([initialState, () => null]));
        localstorage.getItem.mockReturnValue(null);

        const [state, _] = useStoredState('testKey', { key: 'value' });

        expect(localstorage.getItem).toHaveBeenCalledWith('testKey');
        expect(useState).toHaveBeenCalledWith({ key: 'value' });
        expect(state).toEqual({ key: 'value' });
    });

    it('initializes state with stored value', () => {
        useState.mockImplementation((initialState) => ([initialState, () => null]));
        localstorage.getItem.mockReturnValue(JSON.stringify({ key: 'storedValue' }));

        const [state, _] = useStoredState('testKey', { key: 'value' });

        expect(localstorage.getItem).toHaveBeenCalledWith('testKey');
        expect(useState).toHaveBeenCalledWith({ key: 'storedValue' });
        expect(state).toEqual({ key: 'storedValue' });
    });

    it('updates state and localstorage when setState is called', () => {
        const setStateMock = jest.fn();
        useState.mockImplementation((initialState) => ([initialState, setStateMock]));
        localstorage.getItem.mockReturnValue(null);

        const [_, setStoredState] = useStoredState('testKey', { key: 'value' });

        setStoredState({ key: 'newValue' });

        expect(localstorage.setItem).toHaveBeenCalledWith('testKey', JSON.stringify({ key: 'newValue' }));
        expect(setStateMock).toHaveBeenCalledWith({ key: 'newValue' });
    });
});