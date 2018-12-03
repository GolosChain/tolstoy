export const routeRegex = {
    PostsIndex: /^\/(@[\w\.\d-]+)\/feed\/?$/,
    UserProfile1: /^\/(@[\w\.\d-]+)\/?$/,
    UserProfile2: /^\/(@[\w\.\d-]+)\/(blog|posts|comments|recommended|transfers|invites|curation-rewards|author-rewards|permissions|created|recent-replies|feed|password|followed|followers|settings|activity|favorites|messages)\/??(?:&?[^=&]*=[^=&]*)*$/,
    UserProfile3: /^\/(@[\w\.\d-]+)\/[\w\.\d-]+/,
    UserEndPoints: /^(blog|posts|comments|recommended|transfers|invites|curation-rewards|author-rewards|permissions|assets|created|recent-replies|feed|password|followed|followers|settings|activity|favorites|messages)$/,
    CategoryFilters: /^\/(hot|votes|responses|trending|trending30|promoted|cashout|payout|payout_comments|created|active)\/?$/gi,
    PostNoCategory: /^\/(@[\w\.\d-]+)\/([\w\d-]+)/,
    Post: /^\/([\w\d\-\/]+)\/(@[\w\d\.-]+)\/([\w\d-]+)(?:\/edit)?\/?(?:$|\?)/,
    PostJson: /^\/([\w\d\-\/]+)\/(@[\w\d\.-]+)\/([\w\d-]+)(\.json)$/,
    UserJson: /^\/(@[\w\.\d-]+)(\.json)$/,
    UserNameJson: /^.*(?=(\.json))/,
};

export default function resolveRoute(path) {
    if (path === '/') {
        return {
            page: 'PostsIndex',
            params: {
                category: 'trending',
            },
        };
    }

    if (path.indexOf('@bm-chara728') !== -1) {
        return { page: 'NotFound' };
    }

    if (path === '/some_error') {
        return { page: 'SomeError' };
    }

    if (path === '/welcome') {
        return { page: 'Welcome' };
    }

    if (path === '/start') {
        return { page: 'Start' };
    }

    if (path === '/about') {
        return { page: 'Landing' };
    }

    if (path === '/faq') {
        return { page: 'Faq' };
    }

    if (path === '/login') {
        return { page: 'Login' };
    }

    if (path === '/privacy.html') {
        return { page: 'Privacy' };
    }

    if (path === '/support.html') {
        return { page: 'Support' };
    }

    if (path === '/xss/test' && process.env.NODE_ENV === 'development') {
        return { page: 'XSSTest' };
    }

    if (path.match(/^\/tags\/?/)) {
        return { page: 'Tags' };
    }

    if (path === '/tos.html') {
        return { page: 'Tos' };
    }

    if (path === '/change_password') {
        return { page: 'ChangePassword' };
    }

    if (path === '/recover_account_step_1') {
        return { page: 'RecoverAccountStep1' };
    }

    if (path === '/recover_account_step_2') {
        return { page: 'RecoverAccountStep2' };
    }

    if (path === '/market') {
        return { page: 'Market' };
    }

    if (path === '/~witnesses') {
        return { page: 'Witnesses' };
    }

    if (path === '/submit') {
        return { page: 'SubmitPost' };
    }

    if (path === '/leave_page') {
        return { page: 'LeavePage' };
    }

    let match = path.match(routeRegex.PostsIndex);

    if (match) {
        return {
            page: 'PostsIndex',
            params: {
                category: 'feed',
                username: normalize(match[1]),
            },
        };
    }

    match = path.match(routeRegex.UserProfile1) || path.match(routeRegex.UserProfile2);

    if (match) {
        return {
            page: 'UserProfile',
            params: {
                username: normalize(match[1]),
                category: match[2] || null,
            },
        };
    }

    match = path.match(routeRegex.PostNoCategory);

    if (match) {
        return {
            page: 'PostNoCategory',
            params: {
                username: normalize(match[1]),
                permLink: match[2],
            },
        };
    }

    match = path.match(routeRegex.Post);

    if (match) {
        return {
            page: 'Post',
            params: {
                category: match[1],
                username: normalize(match[2]),
                permLink: match[3],
            },
        };
    }

    match =
        path.match(
            /^\/(hot|votes|responses|trending|trending30|promoted|cashout|payout|payout_comments|created|active)\/?$/
        ) ||
        decodeURI(path).match(
            /^\/(hot|votes|responses|trending|trending30|promoted|cashout|payout|payout_comments|created|active)\/([\u0400-\u04FF\w\d-]+)\/?$/
        );

    if (match) {
        return {
            page: 'PostsIndex',
            params: {
                category: match[1],
            },
        };
    }

    return { page: 'NotFound' };
}

function normalize(name) {
    return name
        .replace(/^@/, '')
        .toLowerCase()
        .trim();
}
