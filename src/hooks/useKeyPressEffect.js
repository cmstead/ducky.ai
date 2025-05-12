import { useEffect, useRef } from "react";

/** 
 * @typedef{{
 * stopPropagation: function,
 * preventDefault: function
 * key: string,
 * }} KeyEvent
 */


export default function useKeyPressEffect(undo) {
    const keypressSet = useRef(new Set());

    useEffect(() => {
        const keysPressed = keypressSet.current;

        const handleKeyDown = (/** @type{KeyEvent} */ event) => {
            keysPressed.add(event.key.toLowerCase());

            if ((keysPressed.has('control') || keysPressed.has('command') || keysPressed.has('meta')) && keysPressed.has('z')) {
                event.stopPropagation();
                event.preventDefault();

                undo();
            }
        }

        const handleKeyUp = (/** @type{KeyEvent} */ event) => {
            keysPressed.clear();
        }

        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);
    }, [undo]);
}