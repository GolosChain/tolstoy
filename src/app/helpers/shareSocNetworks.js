import { serverApiRecordEvent } from 'app/utils/ServerApiClient';

export const fbShare = (e, post) => {
    e.preventDefault();

    window.FB.ui(
        {
            method: 'share',
            href: location.href.replace(/#.*$/, ''),
        },
        response => {
            if (response && !response.error_message) {
                serverApiRecordEvent('FbShare', post.link);
            }
        }
    );
};

export const twitterShare = (e, post) => {
    e.preventDefault();

    const winWidth = 640;
    const winHeight = 320;
    const winTop = screen.height / 2 - winWidth / 2;
    const winLeft = screen.width / 2 - winHeight / 2;

    const hashtags = post.tags.map(({ tag }) => tag);

    const linkParams = {
        url: location.href.replace(/#.*$/, ''),
        text: post.title,
        hashtags: hashtags.join(','),
    };

    const shareUrl = Object.keys(linkParams)
        .map(param => param + '=' + encodeURIComponent(linkParams[param]))
        .join('&');

    window.open(
        'http://twitter.com/share?' + shareUrl,
        post.title,
        `top=${winTop},left=${winLeft},toolbar=0,status=0,width=${winWidth},height=${winHeight}`
    );
};

export const vkShare = (e, post) => {
    e.preventDefault();

    const winWidth = 720;
    const winHeight = 480;
    const winTop = screen.height / 2 - winWidth / 2;
    const winLeft = screen.width / 2 - winHeight / 2;

    window.open(
        'https://vk.com/share.php?url=' + location.href.replace(/#.*$/, ''),
        post.title,
        `top=${winTop},left=${winLeft},toolbar=0,status=0,width=${winWidth},height=${winHeight}`
    );
};

export const ljShare = (e, post) => {
    e.preventDefault();

    const href = post.url;
    const title = post.title;
    const desc = post.desc;
    const link = `<div><a href=${href}>${title}</a></div>`;

    window.open(`http://www.livejournal.com/update.bml?subject=${title}&event=${desc + link}`);
};
