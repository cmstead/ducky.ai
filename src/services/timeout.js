const timeout = {
    setTimeout: (fn, timeout) => setTimeout(fn, timeout),
    clearTimeout: (timeoutId) => clearTimeout(timeoutId),
}

export default timeout;
