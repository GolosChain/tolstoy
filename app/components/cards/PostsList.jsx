import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import throttle from 'lodash/throttle';

import PostSummary from 'app/components/cards/PostSummary';
import LoadingIndicator from 'app/components/elements/LoadingIndicator';
import { dataSelector } from 'src/app/redux/selectors/common';
import { getScrollElement } from 'src/app/helpers/window';

function topPosition(domElt) {
    if (!domElt) {
        return 0;
    }
    return domElt.offsetTop + topPosition(domElt.offsetParent);
}

@connect(
    (state, props) => {
        const current = state.user.get('current');
        const username = current ? current.get('username') : state.offchain.get('account');

        const settings = dataSelector('settings')(state);

        return {
            ...props,
            username,
            content: state.global.get('content'),
            ignoreResult: state.global.getIn([
                'follow',
                'getFollowingAsync',
                username,
                'ignore_result',
            ]),
            nsfw: settings.getIn(['basic', 'nsfw']),
            pathname: state.app.get('location').pathname,
        };
    }
)
export default class PostsList extends PureComponent {
    static propTypes = {
        posts: PropTypes.object.isRequired,
        loading: PropTypes.bool.isRequired,
        category: PropTypes.string,
        loadMore: PropTypes.func,
        showSpam: PropTypes.bool,
        pathname: PropTypes.string,
        ignoreResult: PropTypes.any,
    };

    static defaultProps = {
        showSpam: false,
    };

    state = {
        thumbSize: 'desktop',
    };

    componentDidMount() {
        this.scrollListener();
        this.attachScrollListener();
    }

    componentWillUnmount() {
        this.detachScrollListener();
    }

    scrollListener = throttle(
        () => {
            const el = window.document.getElementById('posts_list');

            if (!el) {
                return;
            }

            const scrollTop = getScrollElement().scrollTop;

            if (topPosition(el) + el.offsetHeight - scrollTop - window.innerHeight < 10) {
                const { loadMore, posts, category } = this.props;

                if (loadMore && posts && posts.size) {
                    loadMore(posts.last(), category);
                }
            }

            // Detect if we're in mobile mode (renders larger preview imgs)
            const mq = window.matchMedia('screen and (max-width: 39.9375em)');
            if (mq.matches) {
                this.setState({ thumbSize: 'mobile' });
            } else {
                this.setState({ thumbSize: 'desktop' });
            }
        },
        150,
        { leading: false }
    );

    attachScrollListener() {
        window.addEventListener('scroll', this.scrollListener);
        window.addEventListener('resize', this.scrollListener);
    }

    detachScrollListener() {
        this.scrollListener.cancel();
        window.removeEventListener('scroll', this.scrollListener);
        window.removeEventListener('resize', this.scrollListener);
    }

    render() {
        const {
            posts,
            showSpam,
            loading,
            category,
            content,
            ignoreResult,
            account,
            nsfw,
        } = this.props;

        const { thumbSize } = this.state;

        const postsInfo = [];

        posts.forEach(item => {
            const cont = content.get(item);
            if (!cont) {
                console.error('PostsList --> Missing cont key', item);
                return;
            }
            const ignore = ignoreResult && ignoreResult.has(cont.get('author'));
            const hide = cont.getIn(['stats', 'hide']);

            if (!(ignore || hide) || showSpam) {
                postsInfo.push({ item, ignore });
            }
        });

        const renderSummary = items =>
            items.map(item => (
                <li key={item.item}>
                    <PostSummary
                        account={account}
                        post={item.item}
                        currentCategory={category}
                        thumbSize={thumbSize}
                        ignore={item.ignore}
                        onClick={this.onPostClick}
                        nsfwPref={nsfw}
                    />
                </li>
            ));

        return (
            <div id="posts_list" className="PostsList">
                <ul
                    className="PostsList__summaries hfeed"
                    itemScope
                    itemType="http://schema.org/blogPosts"
                >
                    {renderSummary(postsInfo)}
                </ul>
                {loading && (
                    <center>
                        <LoadingIndicator type="circle" />
                    </center>
                )}
            </div>
        );
    }
}
