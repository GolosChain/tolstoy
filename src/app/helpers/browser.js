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

export function addChunkLoadingErrorHandler() {
    window.addEventListener('unhandledrejection', err => {
        // Catch errors like:
        //    "Loading chunk 0 failed"
        //    "Loading CSS chunk 0 failed"
        if (err && err.reason && /Loading.+chunk.+failed/.test(err.reason)) {
            const storeKey = 'golos.lastErrorReload';

            const lastErrorReload = sessionStorage.getItem(storeKey);
            const now = new Date();

            if (!lastErrorReload || now.getTime() > new Date(lastErrorReload).getTime() + 10000) {
                sessionStorage.setItem(storeKey, now.toJSON());
                location.reload();
            }
        }
    });
}
