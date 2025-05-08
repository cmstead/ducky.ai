export function confirm(message) {
    return new Promise(function (resolve, reject) {
        var result = window.confirm(message);
        if (result) {
            resolve(true);
        } else {
            reject()
        }
    });
}