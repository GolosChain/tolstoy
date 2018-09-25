import { createDeepEqualSelector } from '../common';
import { currentPostSelector } from './commanPost';
import tt from 'counterpart';
import { serverApiRecordEvent } from 'app/utils/ServerApiClient';

export const sharePopoverSelector = createDeepEqualSelector([currentPostSelector], post => ({
    shareMenu: [
        {
            link: '#',
            onClick: e => ljShare(e, post),
            value: 'LJ',
            title: tt('postfull_jsx.share_on_lj'),
            icon: 'lj',
        },
        {
            link: '#',
            onClick: e => vkShare(e, post),
            value: 'VK',
            title: tt('postfull_jsx.share_on_vk'),
            icon: 'vk',
        },
        {
            link: '#',
            onClick: e => fbShare(e, post),
            value: 'Facebook',
            title: tt('postfull_jsx.share_on_facebook'),
            icon: 'facebook',
        },
        {
            link: '#',
            onClick: e => twitterShare(e, post),
            value: 'Twitter',
            title: tt('postfull_jsx.share_on_twitter'),
            icon: 'twitter',
        },
    ],
}));

const fbShare = (e, post) => {
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

const twitterShare = (e, post) => {
    e.preventDefault();

    const winWidth = 640;
    const winHeight = 320;
    const winTop = screen.height / 2 - winWidth / 2;
    const winLeft = screen.width / 2 - winHeight / 2;

    const q = 'text=' + encodeURIComponent(post.title) + '&url=' + encodeURIComponent(post.url);

    window.open(
        'http://twitter.com/share?' + q,
        'Share',
        `top=${winTop},left=${winLeft},toolbar=0,status=0,width=${winWidth},height=${winHeight}`
    );
};

const vkShare = (e, post) => {
    e.preventDefault();
    const winWidth = 720;
    const winHeight = 480;
    const winTop = screen.height / 2 - winWidth / 2;
    const winLeft = screen.width / 2 - winHeight / 2;

    window.open(
        'https://vk.com/share.php?url=' + post.url,
        post,
        `top=${winTop},left=${winLeft},toolbar=0,status=0,width=${winWidth},height=${winHeight}`
    );
};

const ljShare = (e, post) => {
    e.preventDefault();

    const href = post.url;
    const title = post.title;
    const desc = post.desc;
    const link = `<div><a href=${href}>${title}</a></div>`;

    window.open(`http://www.livejournal.com/update.bml?subject=${title}&event=${desc + link}`);
};
