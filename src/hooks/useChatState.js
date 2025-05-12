import { confirm } from '../services/confirmService.js';
import useUndoableState from './useUndoableState.js';

/** @typedef{{ current: unknown }} Ref */
/** 
 * @typedef {object} TextareaRef
 * @extends Ref
 * @property {HTMLTextAreaElement} current
*/
/** @typedef{{date: string; message: string, selected: boolean }} Message*/

export default function useChatState() {
    const [chatLog, updateChatLog, undo] = useUndoableState('duckyState', []);

    const setChatNodeSelection = (index, selected) => {
        const newChatLog = chatLog.map(( /** @type{Message} */ msg, /** @type{number} */ i) => {
            if (i === index) {
                return { ...msg, selected: selected };
            }

            return msg;
        });

        updateChatLog(newChatLog);
    }

    const deleteChatNode = (index) => {
        const newChatLog = chatLog.filter(( /** @type{unknown} */ _, /** @type{number} */ i) => i !== index);
        updateChatLog(newChatLog);
    }

    const clearLog = () => {
        confirm("Are you sure you want to clear unpinned messages?")
            .then(() => updateChatLog(chatLog.filter(( /** @type{Message} */ msg) => msg.selected)))
            .catch(() => { });
    }

    return [chatLog, { setChatNodeSelection, deleteChatNode, clearLog, updateChatLog, undoChatAction: undo }];
}