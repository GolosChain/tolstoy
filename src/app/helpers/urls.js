import { LEAVE_PAGE_WHITELIST_LINKS, LEAVE_PAGE_WHITELIST_DOMAINS } from 'app/client_config';

function checkIsWhitelistUrl(url) {
    try {
        const hostname = new URL(url).hostname;

        if (
            LEAVE_PAGE_WHITELIST_LINKS.includes(url) ||
            LEAVE_PAGE_WHITELIST_DOMAINS.some(
                domain => domain === hostname || hostname.endsWith('.' + domain)
            )
        ) {
            return true;
        }

        return false
    } catch (err) {
        return false
    }
}

export function makeLeaveLink(url) {
    if (checkIsWhitelistUrl(url)) {
        return url;
    } else {
        return '/leave_page?' + url;
    }
}

export function makeSocialLink(urlOrName, prefix) {
    let accountName;

    if (/^(https?:)?\/\//.test(urlOrName)) {
        try {
            const pathname = new URL(urlOrName).pathname.substr(1);

            accountName = pathname.match(/^[^/]+/)[0];
        } catch (err) {
            return urlOrName;
        }
    } else {
        accountName = urlOrName;
    }

    return prefix + accountName;
}
