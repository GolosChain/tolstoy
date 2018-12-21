const request_base = {
    method: 'post',
    mode: 'no-cors',
    credentials: 'same-origin',
    headers: {
        Accept: 'application/json',
        'Content-type': 'application/json',
    },
};

export function serverApiLogin(account, signatures) {
    if (!process.env.BROWSER || window.$STM_ServerBusy) return;
    const request = Object.assign({}, request_base, {
        body: JSON.stringify({ account, signatures, csrf: $STM_csrf }),
    });
    return fetch('/api/v1/login_account', request).then(response => response);
}

export function serverApiLogout() {
    if (!process.env.BROWSER || window.$STM_ServerBusy) return;
    const request = Object.assign({}, request_base, { body: JSON.stringify({ csrf: $STM_csrf }) });
    return fetch('/api/v1/logout_account', request).then(response => response);
}

export function recordPageView(page, ref, posts) {
    if (window.ga) {
        // virtual pageview
        let guid = localStorage.getItem('guid');
        if (guid) {
            window.ga('set', 'userId', guid);
        }
        window.ga('set', 'page', page);
        window.ga('send', 'pageview');
        window.fbq('track', 'ViewContent');
    }
}
