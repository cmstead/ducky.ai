import "./App.scss";
import { useRef } from "react";
import React from "react";

import ChatLog from "./components/ChatLog/ChatLog.js";
import ChatBox from "./components/ChatBox/ChatBox.js";
import useChatState from "./hooks/useChatState.js";
import useKeyPressEffect from "./hooks/useKeyPressEffect.js";
import useSetChatFocus from "./hooks/useSetChatFocus.js";

function App() {
  const inputBoxRef = useRef(null);
  const [chatLog, chatManagementApi] = useChatState();
  const { setChatNodeSelection, deleteChatNode, clearLog, updateChatLog, undoChatAction } = chatManagementApi;

  useKeyPressEffect(undoChatAction);
  useSetChatFocus(inputBoxRef, chatLog);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Ducky.ai</h1>
      </header>
      <ChatLog
        chatLog={chatLog} 
        deleteChatNode={deleteChatNode}
        setChatNodeSelection={setChatNodeSelection} />
      <ChatBox
        chatLog={chatLog}
        clearLog={clearLog}
        updateChatLog={updateChatLog}
        inputBoxRef={inputBoxRef} />
    </div>
  );
}

export default App;
