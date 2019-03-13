import { head, last } from 'ramda';

const NATURAL_SIZE = '0x0/';

/**
 * this regular expression should capture all possible proxy domains
 * Possible URL schemes are:
 * {proxy}/{file url}
 * {proxy}/{int}x{int}/{external domain and file url}
 * {proxy}/{int}x{int}/[...{proxy}/{int}x{int}/]{external domain and file url}
 * {proxy}/{int}x{int}/[{proxy}/{int}x{int}/]{proxy}/{file url}
 */
const rProxyDomain = /^https?:\/\/(?:imgp|images)\.golos\.io\//;
const rProxyDomainsDimensions = /https?:\/\/(?:imgp|images)\.golos\.io\/\d+x\d+\//g;

/**
 * Strips all proxy domains from the beginning of the url. Adds the global proxy if dimension is specified
 * @param {string} url
 * @param {string|boolean} [dimensions] if provided url is proxied & global $STM_Config.img_proxy_prefix is avail.
 *                                      resp will be "{$STM_Config.img_proxy_prefix}{dimensions}/{sanitized url}"
 *                                      if falsy, all proxies are stripped.
 *                                      if true, preserves the first {int}x{int} in a proxy url. If not found, uses 0x0
 */
export default function(url, dimensions = false) {
    let respUrl = url;

    const proxyList = url.match(rProxyDomainsDimensions);

    if (proxyList) {
        const lastProxy = last(proxyList);
        respUrl = url.substring(url.lastIndexOf(lastProxy) + lastProxy.length);
    }

    if (dimensions && $STM_Config && $STM_Config.img_proxy_prefix) {
        let dims;

        if (typeof dimensions === 'string') {
            dims = dimensions + '/';
        } else if (proxyList) {
            dims = head(proxyList).match(/\d+x\d+\//)[0];
        } else {
            dims = NATURAL_SIZE;
        }

        if (dims !== NATURAL_SIZE || !rProxyDomain.test(respUrl)) {
            return $STM_Config.img_proxy_prefix + dims + respUrl;
        }
    }

    return respUrl;
}
