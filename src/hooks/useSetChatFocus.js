import { useEffect } from 'react';

export default function useSetChatFocus(inputBoxRef, chatLog) {
    useEffect(() => {
        if (inputBoxRef.current) {
            inputBoxRef.current.focus();
        }

    }, [chatLog.length, inputBoxRef]);
};