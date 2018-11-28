export function getImageSrc(size, url) {
    const proxy = $STM_Config.img_proxy_prefix;

    if (proxy) {
        return `${proxy}${size}/${url}`;
    } else {
        return url;
    }
}
