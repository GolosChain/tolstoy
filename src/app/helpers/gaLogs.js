export function logClickEvent(eventCategory, eventLabel) {
    window.ga('send', {
        hitType: 'event',
        eventCategory,
        eventAction: 'click',
        eventLabel,
    });
}

export function logOutboundLinkClickEvent(eventLabel) {
    window.ga('send', {
        hitType: 'event',
        eventCategory: 'Outbound Link',
        eventAction: 'click',
        eventLabel,
        transport: 'beacon',
    });
}

export function logSuccessOperationEvent(eventAction, eventLabel) {
    window.ga('send', {
        hitType: 'event',
        eventCategory: 'Operation',
        eventAction,
        eventLabel,
    });
}
