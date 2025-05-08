import useStoredState from "./useStoredState";

export default function useUndoableState(stateName, initialState) {
    const [state, updateState] = useStoredState(stateName, initialState);
    const [undoState, updateUndoState] = useStoredState('undo', [initialState]);

    function update(newState) {
        if (undoState.length > 9) {
            undoState.shift();
        }

        updateState(newState);
        updateUndoState([...undoState, state]);
    }

    const last = values => values[values.length - 1];

    function undo() {
        const previousState = last(undoState);

        if (typeof previousState === 'undefined') {
            return;
        }

        updateState(previousState);
        updateUndoState(undoState.slice(0, -1));
    }

    return [state, update, undo];
}