/* eslint-disable import/prefer-default-export,func-names */

export const getScrollbarWidth = (function() {
  let scrollbarWidth = null;

  return function() {
    if (scrollbarWidth === null) {
      const containerDiv = document.createElement('div');

      containerDiv.innerHTML = `
        <div style="position: absolute; top: -200px; width: 100px; height: 100px; overflow: scroll; visibility: hidden;"></div>
      `;

      const div = containerDiv.firstElementChild;
      document.body.append(div);
      scrollbarWidth = div.offsetWidth - div.clientWidth;
      div.remove();
    }

    return scrollbarWidth;
  };
})();

export function setScrollRestoration(type) {
  if ('scrollRestoration' in window.history) {
    window.history.scrollRestoration = type;
  }
}

export function getScrollContainer(element) {
  if (element && element.closest) {
    const container = element.closest('.scroll-container');

    if (container) {
      return container;
    }
  }

  if (document.scrollingElement) {
    return document.scrollingElement;
  }

  return window;
}
