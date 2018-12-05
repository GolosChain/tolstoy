export function logClickEvent(eventCategory, eventAction, eventLabel) {
    window.ga('send', {
        hitType: 'event',
        eventCategory,
        eventAction,
        eventLabel,
    });
}
