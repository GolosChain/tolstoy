import { serverApiRecordEvent } from 'app/utils/ServerApiClient';

export const fbShare = (e, post) => {
    e.preventDefault();
    const href = post.url;

    window.FB.ui(
        {
            method: 'share',
            href,
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
        url: location.href,
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
        'https://vk.com/share.php?url=' + location.href,
        post.title,
        `top=${winTop},left=${winLeft},toolbar=0,status=0,width=${winWidth},height=${winHeight}`
    );
};

export const ljShare = (e, post) => {
    e.preventDefault();

    const title = post.title;
    const link = `<div><a href="${location.href}">${title}</a></div>`;

    window.open(`http://www.livejournal.com/update.bml?subject=${title}&event=${post.desc + link}`);
};
