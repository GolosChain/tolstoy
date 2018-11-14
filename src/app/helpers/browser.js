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
