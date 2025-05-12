import React, { useState } from "react";
import getKeyEventHandlers from "./key-event-handlers.js";
import getChatService, { getChatMessageContext, buildMessageRecord } from "../../services/ai-chat-service.js";

/** @typedef{import("../../hooks/useStoredState.js")} State */
/** @typedef{import("../../hooks/useStoredState.js")} StoredStateTuple */
/** @typedef{{key: string; target: {value: string; name: string;}}} KeyEvent */

export default function ChatBox({ chatLog, clearLog, updateChatLog, inputBoxRef }) {
    const [showListening, updateListeningState] = useState(false);

    const appendToChatLog = (/** @type{KeyEvent} */ event) => {
        const message = event.target.value.trim();

        if (message !== '') {
            const updatedChatLog = [...chatLog, buildMessageRecord(message, 'user')];
            updateChatLog(updatedChatLog);

            if (/^.+\?.*$/.test(message)) {
                updateListeningState(true);

                const chatContext = getChatMessageContext(updatedChatLog);

                const storeAiResponse = (responseRecord) =>
                    updateChatLog([...updatedChatLog, responseRecord]);

                getChatService(storeAiResponse).sendChat(chatContext);
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