const SMALL_SCREEN_WIDTH = 576;

export function getScrollElement() {
    return (
        document.scrollingElement ||
        document.documentElement ||
        document.body.parentNode ||
        document.body
    );
}

export function checkSmallScreen() {
    return window.innerWidth <= SMALL_SCREEN_WIDTH;
}
