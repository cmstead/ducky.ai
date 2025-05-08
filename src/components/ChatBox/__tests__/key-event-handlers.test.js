import getKeyEventHandlers from "../key-event-handlers";
import timeout from "../../../services/timeout";

jest.mock("../../../services/timeout", () => ({
    setTimeout: jest.fn(),
    clearTimeout: jest.fn(),
}));

describe("getKeyEventHandlers", () => {
    describe("handleKeyUp", () => {
        it("should update shift state to 'up' when Shift key is released", () => {
            const updateListeningState = jest.fn();
            const appendToChatLog = jest.fn();
            const clearLog = jest.fn();

            const { handleKeyUp } = getKeyEventHandlers(
                updateListeningState,
                appendToChatLog,
                clearLog
            );

            handleKeyUp({ key: "Shift" });

            expect(updateListeningState).toHaveBeenCalledTimes(1);
            expect(updateListeningState).toHaveBeenCalledWith(false);
        });

        it("should call appendToChatLog when Enter key is pressed and shift is not down", () => {
            const updateListeningState = jest.fn();
            const appendToChatLog = jest.fn();
            const clearLog = jest.fn();

            const { handleKeyUp } = getKeyEventHandlers(
                updateListeningState,
                appendToChatLog,
                clearLog
            );

            handleKeyUp({ key: "Enter", target: { value: "test" } });

            expect(appendToChatLog).toHaveBeenCalled();
        });

        it("should call clearLog when Enter key is pressed and .clear command is given", () => {
            const updateListeningState = jest.fn();
            const appendToChatLog = jest.fn();
            const clearLog = jest.fn();

            const { handleKeyUp } = getKeyEventHandlers(
                updateListeningState,
                appendToChatLog,
                clearLog
            );

            handleKeyUp({ key: "Enter", target: { value: ".clear" } });

            expect(clearLog).toHaveBeenCalled();
        });
    });
});