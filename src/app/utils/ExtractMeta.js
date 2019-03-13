import extractContent from 'src/app/utils/ExtractContent';
import normalizeProfile from 'src/app/utils/NormalizeProfile';
import {
    SEO_TITLE,
    APP_DOMAIN,
    SITE_DESCRIPTION,
    TWITTER_HANDLE,
    SHARE_IMAGE,
    TWITTER_SHARE_IMAGE,
    ANDROID_APP_NAME,
    ANDROID_PACKAGE,
    ANDROID_URL_SCHEME,
} from 'src/app/client_config';

export default function extractMeta(chainData, routeParams) {
    const meta = [];

    // post
    if (routeParams.username && routeParams.slug) {
        const post = `${routeParams.username}/${routeParams.slug}`;
        const content = chainData.content[post];
        const author = chainData.accounts[routeParams.username];
        const profile = normalizeProfile(author);

        // API currently returns 'false' data with id 0.0.0 for posts that do not exist
        if (content && content.id !== '0.0.0') {
            const d = extractContent(content);
            const url = 'https://' + APP_DOMAIN + d.link;
            const title = d.title + ' | ' + SEO_TITLE;
            const desc = d.desc + ' by ' + d.author;
            const image = d.image_link || profile.profile_image || SHARE_IMAGE;
            const { category, created } = d;

            // Standard meta
            meta.push({ canonical: url });
            meta.push({ name: 'description', content: desc });

            // Open Graph data
            meta.push(
                { property: 'og:title', content: title },
                { property: 'og:type', content: 'article' },
                { property: 'og:url', content: url },
                { property: 'og:image', content: image },
                { property: 'og:description', content: desc },
                { property: 'og:site_name', content: SEO_TITLE },
                { property: 'fb:app_id', content: $STM_Config.fb_app },
                { property: 'article:tag', content: category },
                { property: 'article:published_time', content: created }
            );

            // Twitter card data
            meta.push(
                { name: 'twitter:card', content: image ? 'summary_large_image' : 'summary' },
                { name: 'twitter:site', content: TWITTER_HANDLE },
                { name: 'twitter:title', content: title },
                { name: 'twitter:description', content: desc },
                { name: 'twitter:image', content: image || TWITTER_SHARE_IMAGE }
            );

            addPlatformMeta(meta, d.link);
        } else {
            addSiteMeta(meta);
        }
    } else if (routeParams.accountName) {
        // user profile root
        const normalizedAccountName = routeParams.accountName.toLowerCase();
        const account = chainData.accounts[normalizedAccountName];
        const accountName = (account && account.name) || '';

        let { name, about, profile_image } = normalizeProfile(account);

        if (name == null) {
            name = accountName;
        }

        if (about == null) {
            about = 'Join thousands on Golos.io who share, post and earn rewards.';
        }

        if (profile_image == null) {
            profile_image = TWITTER_SHARE_IMAGE;
        }

        // Set profile tags
        const title = `@${accountName}`;
        const desc = `The latest posts from ${name}. Follow me at @${accountName}. ${about}`;

        // Standard meta
        meta.push({ name: 'description', content: desc });

        // Twitter card data
        meta.push(
            { name: 'twitter:card', content: 'summary' },
            { name: 'twitter:site', content: TWITTER_HANDLE },
            { name: 'twitter:title', content: title },
            { name: 'twitter:description', content: desc },
            { name: 'twitter:image', content: profile_image }
        );

        addPlatformMeta(meta, `/@${accountName}`);
    } else {
        addSiteMeta(meta);
    }

    return meta;
}

function addSiteMeta(metas) {
    metas.push(
        { name: 'description', content: SITE_DESCRIPTION },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: SEO_TITLE },
        { property: 'og:title', content: SEO_TITLE },
        { property: 'og:description', content: SITE_DESCRIPTION },
        { property: 'og:image', content: SHARE_IMAGE }
    );

    if ($STM_Config.fb_app) {
        metas.push({ property: 'fb:app_id', content: $STM_Config.fb_app });
    }

    metas.push(
        { name: 'twitter:card', content: 'summary' },
        { name: 'twitter:site', content: TWITTER_HANDLE },
        { name: 'twitter:title', content: SEO_TITLE },
        { name: 'twitter:description', site_desc: SITE_DESCRIPTION },
        { name: 'twitter:image', content: SHARE_IMAGE },
        { name: 'al:android:app_name', content: ANDROID_APP_NAME },
        { name: 'al:android:package', content: ANDROID_PACKAGE }
    );
}

function addPlatformMeta(metas, url) {
    metas.push(
        { property: 'al:android:url', content: `${ANDROID_URL_SCHEME}://${APP_DOMAIN}${url}` },
        { property: 'al:android:app_name', content: ANDROID_APP_NAME },
        { property: 'al:android:package', content: ANDROID_PACKAGE }
    );
}
