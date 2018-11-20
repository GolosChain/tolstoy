import { getScrollElement } from 'src/app/helpers/window';

export function init() {
    window.addEventListener('hashchange', () => {
        tryMoveToAnchor();
    });

    window.addEventListener('click', e => {
        if (!e.defaultPrevented && e.target.closest('a[href]')) {
            setTimeout(() => {
                tryMoveToAnchor();
            }, 10);
        }
    });

    let testsCount = 0;
    const interval = setInterval(() => {
        tryMoveToAnchor();

        if (++testsCount === 10) {
            clearInterval(interval);
        }
    }, 100);
}

function tryMoveToAnchor() {
    const hash = location.hash.substr(1);

    if (hash) {
        const anchor = document.getElementById(hash);

        if (anchor) {
            if (anchor.scrollIntoViewIfNeeded) {
                anchor.scrollIntoViewIfNeeded();
            } else if (anchor.scrollIntoView) {
                anchor.scrollIntoView();
            }

            const bound = anchor.getBoundingClientRect();

            const delta = Math.round(120 + window.innerHeight / 6 - bound.top);

            if (delta > 0) {
                getScrollElement().scrollTop -= delta;
            }
        }
    }
}
