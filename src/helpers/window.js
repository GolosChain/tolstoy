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

export const smoothScroll = (targetY, duration) => {
  const startingY = window.pageYOffset;
  const diff = targetY - startingY;

  let start;

  if (!diff) {
    return;
  }

  window.requestAnimationFrame(step);

  function step(timestamp) {
    if (!start) {
      start = timestamp;
    }

    const time = timestamp - start;
    const percent = Math.min(time / duration, 1);

    window.scrollTo(0, startingY + diff * percent);

    if (time < duration) {
      window.requestAnimationFrame(step);
    }
  }
};
