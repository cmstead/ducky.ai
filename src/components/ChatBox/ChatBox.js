import React, { useState } from "react";
import getKeyEventHandlers from "./key-event-handlers.js";
import { getAIResponse } from "../../services/ai-service.js";

/** @typedef{import("../../hooks/useStoredState.js")} State */
/** @typedef{import("../../hooks/useStoredState.js")} StoredStateTuple */
/** @typedef{{key: string; target: {value: string; name: string;}}} KeyEvent */

export default function ChatBox({ chatLog, clearLog, updateChatLog, inputBoxRef, undo }) {
    const [showListening, updateListeningState] = useState(false);

    const appendToChatLog = (/** @type{KeyEvent} */ event) => {
        const message = event.target.value.trim();

        const messageRecord = {
            source: 'user',
            message: message,
            date: new Date().toLocaleTimeString()
        }

        const updatedChatLog = [...chatLog, messageRecord];

        if (message !== '') {
            updateChatLog(updatedChatLog);

            if (/^.+\?.*$/.test(message)) {
                const messageCount = 5;
                updateListeningState(true);

                getAIResponse(updatedChatLog.slice(updateChatLog.length - (1 + messageCount)))
                    .then((response) => {
                        const responseRecord = {
                            source: 'assistant',
                            message: response.response.output_text,
                            date: new Date().toLocaleTimeString()
                        }

                        const updatedChatLogWithResponse = [...updatedChatLog, responseRecord];
                        updateChatLog(updatedChatLogWithResponse);
                        updateListeningState(true);
                    })
                    .catch((error) => {
                        console.error('Error fetching AI response:', error);
                        updateListeningState(true);
                    });
            }
        }

        if (inputBoxRef && inputBoxRef.current) {
            inputBoxRef.current.value = '';
        }
    }

    const { handleKeyDown, handleKeyUp } = getKeyEventHandlers(updateListeningState, appendToChatLog, clearLog);

    return (
        <>
            <div className="clear-log" >
                {
                    chatLog.length > 0 && showListening ? <span className="listening">listening...</span> : null
                }
                {
                    chatLog.length > 0 ? <button onClick={() => clearLog()}>clear chat</button> : null
                }
            </div>
            <div id="chat-input">
                <textarea
                    ref={inputBoxRef}
                    id="chat-input"
                    placeholder="Type then press enter."
                    onKeyUp={(e) => handleKeyUp(e)}
                    onKeyDown={(e) => handleKeyDown(e)}
                    rows={5}
                />
            </div>
            <div className="info">This supports markdown.</div>
        </>
    );
}