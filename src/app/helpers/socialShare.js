import { serverApiRecordEvent } from 'app/utils/ServerApiClient';

export const shareList = [
    {
        label: 'LiveJournal',
        icon: 'lj',
        ariaLabel: 'aria_label.share_on_lj',
        callback: ljShare,
    },
    {
        label: 'VK',
        icon: 'vk',
        ariaLabel: 'aria_label.share_on_vk',
        callback: vkShare,
    },
    {
        label: 'Facebook',
        icon: 'facebook',
        ariaLabel: 'aria_label.share_on_facebook',
        callback: fbShare,
    },
    {
        label: 'Twitter',
        icon: 'twitter',
        ariaLabel: 'aria_label.share_on_twitter',
        callback: twitterShare,
    },
];

function fbShare(post) {
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
}

function twitterShare(post) {
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
}

function vkShare(post) {
    const winWidth = 720;
    const winHeight = 480;
    const winTop = screen.height / 2 - winWidth / 2;
    const winLeft = screen.width / 2 - winHeight / 2;

    window.open(
        'https://vk.com/share.php?url=' + location.href.replace(/#.*$/, ''),
        post.title,
        `top=${winTop},left=${winLeft},toolbar=0,status=0,width=${winWidth},height=${winHeight}`
    );
}

function ljShare(post) {
    const title = post.title;
    const link = `<div><a href="${location.href.replace(/#.*$/, '')}">${title}</a></div>`;

    window.open(`http://www.livejournal.com/update.bml?subject=${title}&event=${post.desc + link}`);
}
