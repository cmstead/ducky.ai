import React from "react";
import Markdown from "react-markdown";
import { confirm } from "../../services/confirmService";

export default function ChatNode({ message: msg, index, deleteChatNode, setChatNodeSelection }) {

    const pinNode = (e, pinned) => {
        if (e.type === 'contextmenu') {
            e.stopPropagation();
            e.preventDefault();
            setChatNodeSelection(index, pinned);
        } else {
            setChatNodeSelection(index, pinned);
        }
    }

    const deleteNode = (e) => {
        e.stopPropagation();
        if (!msg.selected) {
            confirm("Are you sure you want to delete this message?")
                .then(() => deleteChatNode(index))
                .catch(() => {
                    console.log("Delete cancelled");
                });
        } else {
            pinNode(e, false);
        }
    }

    return (
        <div key={index} title={msg.selected ? "" : "Right click/command click to pin"} className={`chat-msg ${msg.selected ? 'selected-msg' : ''}`} onContextMenu={(e) => pinNode(e, true)}>
            <div className="date">{msg.date}</div>
            <div className="message">
                <Markdown>{msg.message}</Markdown>
            </div>
            <div>
                <button type="button" className="delete-option" onClick={deleteNode}>{msg.selected ? '📌' : '🆇'}</button>
            </div>
            <div className="clear">&nbsp;</div>
        </div>
    );
}