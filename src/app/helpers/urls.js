export function makeSocialLink(urlOrName, prefix) {
    let accountName;

    if (/^(https?:)?\/\//.test(urlOrName)) {
        try {
            const pathname = new URL(urlOrName).pathname.substr(1);

            accountName = pathname.match(/^[^/?#]+/)[0];
        } catch (err) {
            return urlOrName;
        }
    } else {
        accountName = urlOrName;
    }

    return prefix + accountName;
}
