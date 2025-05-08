/** @typedef{import("./ChatBox.js").KeyEvent} KeyEvent */
/** @typedef{number} TimeoutId */

const KEY_UP = 'up';
const KEY_DOWN = 'down';

const state = {
    shift: KEY_UP,
    /** @type{?TimeoutId} */ timeout: null
};

function updateShiftState(/** @type{string} */ shiftState) {
    state.shift = shiftState;
}

function getTimeout(updateListeningState) {
    return setTimeout(() => updateListeningState(true), 1000)
}

export default function getKeyEventHandlers(updateListeningState, appendToChatLog, clearLog) {
    function setListeningTimeout() {
        if (state.timeout) {
            clearTimeout(state.timeout);
        }

        const newTimeout = getTimeout(updateListeningState).toString();
        state.timeout = parseInt(newTimeout, 10);

        updateListeningState(false);
    }

    function handleKeyDown(event) {
        if (event.key === 'Shift') {
            updateShiftState(KEY_DOWN);
        }
    }

    function handleKeyUp(event) {
        const executing = event.key === 'Enter' && state.shift !== KEY_DOWN;

        setListeningTimeout();

        if (event.key === 'Shift') {
            updateShiftState(KEY_UP);
        }

        if (executing && event.target.value.trim().toLowerCase() === '.clear') {
            clearLog();
            event.target.value = '';
        } else if (executing) {
            appendToChatLog(event);
        }
    }

    return {
        handleKeyDown,
        handleKeyUp
    };
}