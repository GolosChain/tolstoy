export function getScrollElement() {
    return (
        document.scrollingElement ||
        document.documentElement ||
        document.body.parentNode ||
        document.body
    );
}
