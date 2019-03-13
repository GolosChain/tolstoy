const isProd = process.env.NODE_ENV === 'production';

export function logClickAnalytics(eventCategory, eventLabel) {
  if (isProd && window.ga) {
    window.ga('send', {
      hitType: 'event',
      eventCategory,
      eventAction: 'click',
      eventLabel,
    });
  }
}

export function logOutboundLinkClickAnalytics(eventLabel) {
  if (isProd && window.ga) {
    window.ga('send', {
      hitType: 'event',
      eventCategory: 'Outbound Link',
      eventAction: 'click',
      eventLabel,
      transport: 'beacon',
    });
  }
}

export function logSuccessOperationAnalytics(eventLabel) {
  if (isProd && window.ga) {
    window.ga('send', {
      hitType: 'event',
      eventCategory: 'Operation',
      eventAction: 'completed',
      eventLabel,
    });
  }
}

export function logOpenDialogAnalytics(eventLabel) {
  if (isProd && window.ga) {
    window.ga('send', {
      hitType: 'event',
      eventCategory: 'Dialog',
      eventAction: 'opened',
      eventLabel,
    });
  }
}
