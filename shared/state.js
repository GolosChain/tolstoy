import { api } from 'golos-js';
import { is, clone } from 'ramda';

export async function processBlog(state, { uname, voteLimit }) {
    const blogEntries = await api.getBlogEntriesAsync(uname, 0, 20);

    const account = state.accounts[uname];

    account.blog = [];

    let pinnedPosts = [];

    try {
        const pinned = JSON.parse(account.json_metadata).pinnedPosts;

        if (Array.isArray(pinned) && pinned.every(is(String))) {
            pinnedPosts = pinned;
        }
    } catch (err) {
        console.error(err);
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

        const isRepost = Boolean(post.reblog_on) && post.reblog_on !== '1970-01-01T00:00:00';

        account.blog.push({
            author,
            permlink,
            postLink,
            isRepost,
            repostData: isRepost
                ? {
                      repostAuthor: post.blog,
                      date: post.reblog_on,
                      title: post.reblog_title,
                      body: post.reblog_body,
                      metadata: post.reblog_json_metadata
                          ? JSON.parse(post.reblog_json_metadata)
                          : {},
                  }
                : null,
        });
    }
}
