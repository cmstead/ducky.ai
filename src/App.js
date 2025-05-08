import "./App.scss";
import { useRef, useEffect } from "react";
import React from "react";

import ChatLog from "./components/ChatLog/ChatLog.js";
import ChatBox from "./components/ChatBox/ChatBox.js";
import { confirm } from "./services/confirmService.js";
import useUndoableState from "./hooks/useUndoableState.js";

/** @typedef{{ current: unknown }} Ref */
/** 
 * @typedef {object} TextareaRef
 * @extends Ref
 * @property {HTMLTextAreaElement} current
*/
/** @typedef{{date: string; message: string, selected: boolean }} Message*/

function App() {
  const /** @type{Message[]} */ initialChatLog = [];
  const [chatLog, updateChatLog, undo] = useUndoableState('duckyState', initialChatLog);

  let /** @type{?TextareaRef} */ inputBoxRef = useRef(null);
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

  useEffect(() => {
    if (inputBoxRef.current) {
      inputBoxRef.current.focus();
    }

  }, [chatLog.length]);

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

  return (
    <div className="App">
      <header className="App-header">
        <h1>Ducky.</h1>
      </header>
      <ChatLog chatLog={chatLog} deleteChatNode={deleteChatNode} setChatNodeSelection={setChatNodeSelection} />
      <ChatBox chatLog={chatLog}
        clearLog={clearLog}
        updateChatLog={updateChatLog}
        inputBoxRef={inputBoxRef}
        undo={undo} />
    </div>
  );
}

export default App;
