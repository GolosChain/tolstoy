export function safePaste(e) {
    try {
        const text = e.clipboardData.getData('text/plain');

        if (document.queryCommandSupported('insertText')) {
            document.execCommand('insertText', false, text);
        } else {
            document.execCommand('paste', false, text);
        }

        e.preventDefault();
        e.stopPropagation();
    } catch (err) {}
}

export function checkMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(
        window.navigator.userAgent
    );
}
