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

export function logSuccessOperationEvent(eventLabel) {
    window.ga('send', {
        hitType: 'event',
        eventCategory: 'Operation',
        eventAction: 'completed',
        eventLabel,
    });
}

export function logOpenDialogEvent(eventLabel) {
    window.ga('send', {
        hitType: 'event',
        eventCategory: 'Dialog',
        eventAction: 'opened',
        eventLabel,
    });
}
