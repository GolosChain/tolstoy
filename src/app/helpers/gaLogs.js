export function logClickAnalytics(eventCategory, eventLabel) {
    window.ga('send', {
        hitType: 'event',
        eventCategory,
        eventAction: 'click',
        eventLabel,
    });
}

export function logOutboundLinkClickAnalytics(eventLabel) {
    window.ga('send', {
        hitType: 'event',
        eventCategory: 'Outbound Link',
        eventAction: 'click',
        eventLabel,
        transport: 'beacon',
    });
}

export function logSuccessOperationAnalytics(eventLabel) {
    window.ga('send', {
        hitType: 'event',
        eventCategory: 'Operation',
        eventAction: 'completed',
        eventLabel,
    });
}

export function logOpenDialogAnalytics(eventLabel) {
    window.ga('send', {
        hitType: 'event',
        eventCategory: 'Dialog',
        eventAction: 'opened',
        eventLabel,
    });
}
