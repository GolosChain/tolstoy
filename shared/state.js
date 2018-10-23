import { api } from 'golos-js';
import { is, clone } from 'ramda';

const DEFAULT_DATE = '1970-01-01T00:00:00';

export async function processBlog(state, { uname, voteLimit }) {
    const blogEntries = await api.getBlogEntriesAsync(uname, 0, 20);

    const account = state.accounts[uname];

    account.blog = [];

    let pinnedPosts = [];

    if (account.json_metadata) {
        try {
            const pinned = JSON.parse(account.json_metadata).pinnedPosts;

            if (Array.isArray(pinned) && pinned.every(is(String))) {
                pinnedPosts = pinned;
            }
        } catch (err) {
            console.error(err);
        }
    }

    const pinnedEntries = pinnedPosts.map(link => {
        const [author, permlink] = link.split('/');

        return {
            author,
            permlink,
        };
    });

    const blog = clone(pinnedEntries);

    outer: for (let entry of blogEntries) {
        for (let { author, permlink } of pinnedEntries) {
            if (entry.author === author && entry.permlink === permlink) {
                continue outer;
            }
        }

        blog.push(entry);
    }

    for (let post of blog) {
        const { author, permlink } = post;

        const postLink = `${author}/${permlink}`;
        const postData = await api.getContentAsync(author, permlink, voteLimit);

        state.content[postLink] = postData;

        account.blog.push(dataToBlogItem(post));
    }
}

export function dataToBlogItem(post) {
    const { author, permlink } = post;

    const postLink = `${author}/${permlink}`;

    // In Api method getDiscussionsByBlog repost date comes in first_reblogged_on field,
    // but in getBlogEntries repost date comes in field reblog_on.
    // 1970-01-01T00:00:00 is date default (like null) in some methods.
    const hasReblogDate = Boolean(post.reblog_on) && post.reblog_on !== DEFAULT_DATE;
    const hasFirstReblogDate =
        Boolean(post.first_reblogged_on) && post.first_reblogged_on !== DEFAULT_DATE;
    const isRepost = hasReblogDate || hasFirstReblogDate || Boolean(post.reblog_author);

    let repostDate;

    if (isRepost) {
        if (hasReblogDate) {
            repostDate = post.reblog_on;
        } else if (hasFirstReblogDate) {
            repostDate = post.first_reblogged_on;
        } else {
            repostDate = post.created;
        }
    }

    return {
        author,
        permlink,
        postLink,
        repostData: isRepost
            ? {
                  isRepost: true,
                  repostAuthor: post.reblog_author || post.blog,
                  date: repostDate,
                  title: post.reblog_title,
                  body: post.reblog_body,
                  metadata: post.reblog_json_metadata ? JSON.parse(post.reblog_json_metadata) : {},
              }
            : null,
    };
}
