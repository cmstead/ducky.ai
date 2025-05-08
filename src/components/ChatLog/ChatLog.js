import React, { useEffect, useRef } from "react";
import ChatNode from "../ChatNode/ChatNode.js";

/** @typedef{import("../../App.js").Ref} */
/**
 * @typedef {object} DivRef
 * @extends Ref
 * @property {HTMLDivElement} current
 */
/** @typedef{import("../../App.js").Message} Message */

export default function ChatLog({ chatLog, deleteChatNode, setChatNodeSelection }) {
    let /** @type{?DivRef} */ chatRef = useRef(null);

    useEffect((...args) => {
        if (chatRef.current) {
            chatRef.current.scrollTo({
                top: chatRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [chatLog.length]);

    return (
        <div id="chat-log" ref={chatRef}>
            {chatLog.map((/** @type{Message} */ msg, i) => (
                <ChatNode key={i}
                    index={i}
                    message={msg}
                    deleteChatNode={deleteChatNode}
                    setChatNodeSelection={setChatNodeSelection} />
            ))}
        </div>
    )
}