import { api } from 'golos-js';
import { is, without, reverse } from 'ramda';

export async function processBlog(state, { uname, voteLimit }) {
    const discussions = await api.getDiscussionsByBlogAsync({
        select_authors: [uname],
        vote_limit: voteLimit,
        limit: 20,
        truncate_body: 1024,
    });
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

    for (let discussion of discussions) {
        const postLink = `${discussion.author}/${discussion.permlink}`;

        account.blog.push(postLink);
        state.content[postLink] = discussion;
    }

    for (let pinned of reverse(pinnedPosts)) {
        if (account.blog.includes(pinned)) {
            account.blog = without([pinned], account.blog);
            account.blog.unshift(pinned);
        } else {
            const [author, permlink] = pinned.split('/');
            const postData = await api.getContentAsync(author, permlink, voteLimit);

            account.blog.unshift(pinned);
            state.content[pinned] = postData;
        }
    }
}
