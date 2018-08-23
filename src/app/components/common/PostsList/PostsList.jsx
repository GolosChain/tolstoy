import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';
import throttle from 'lodash/throttle';
import immutable from 'immutable';
import PostCard from 'src/app/components/common/PostCard';
import CommentCard from 'src/app/components/common/CommentCard';
import { isFetchingOrRecentlyUpdated } from 'app/utils/StateFunctions';
import LoadingIndicator from 'app/components/elements/LoadingIndicator';
import PostOverlay from '../PostOverlay';
import keyCodes from 'app/utils/keyCodes';

const FORCE_GRID_WIDTH = 1200;

const Root = styled.div`
    ${is('grid')`
        display: flex;
        flex-wrap: wrap;
        position: relative;
        margin: 0 -8px;
    `};
`;

const Loader = styled.div`
    margin-bottom: 20px;
`;

const EntryWrapper = styled.div`
    margin-bottom: 16px;

    ${is('grid')`
        max-width: 33.3333%;
        flex-basis: 317px;
        flex-grow: 1;
        vertical-align: top;
        padding: 0 8px;
        
        @media (max-width: 1180px) {
            max-width: 50%;
        }

        @media (max-width: 890px) {
            max-width: 33.3333%;
        }

        @media (max-width: 750px) {
            max-width: 50%;
        }

        @media (max-width: 600px) {
            max-width: 100%;
        }
    `};
`;

export default class PostsList extends PureComponent {
    static propTypes = {
        pageAccountName: PropTypes.string.isRequired,
        content: PropTypes.instanceOf(immutable.Map),
        posts: PropTypes.instanceOf(immutable.List),
        layout: PropTypes.oneOf(['list', 'grid']),
        allowInlineReply: PropTypes.bool,
        showPinButton: PropTypes.bool,
    };

    static defaultProps = {
        posts: immutable.List(),
        layout: 'list',
    };

    state = {
        forceGrid: false,
        showPostPermLink: null,
    };

    componentDidMount() {
        window.addEventListener('scroll', this._onScroll);
        window.addEventListener('resize', this._onResizeLazy);

        this._initialUrl = location.pathname + location.search + location.hash;

        if (window.innerWidth < FORCE_GRID_WIDTH) {
            this.setState({
                forceGrid: true,
            });
        }
    }

    componentWillUnmount() {
        window.removeEventListener('popstate', this._onPopState);
        window.removeEventListener('keydown', this._onKeyDown);
        window.removeEventListener('scroll', this._onScroll);
        window.removeEventListener('resize', this._onResizeLazy);
        this._onResizeLazy.cancel();
        this._onScroll.cancel();
    }

    render() {
        const {
            posts,
            category,
            layout,
            allowInlineReply,
            pageAccountName,
            showPinButton,
            isFavorite,
        } = this.props;

        const { forceGrid } = this.state;

        const isPosts = category === 'blog' || isFavorite;

        const isGrid = isPosts && (layout === 'grid' || forceGrid);
        const EntryComponent = isPosts ? PostCard : CommentCard;

        return (
            <Root innerRef={this._onRef} grid={isGrid}>
                {posts.map(permLink => (
                    <EntryWrapper key={permLink} grid={isGrid}>
                        <EntryComponent
                            permLink={permLink}
                            grid={isGrid}
                            allowInlineReply={allowInlineReply}
                            pageAccountName={pageAccountName}
                            showPinButton={showPinButton}
                            onClick={this._onEntryClick}
                        />
                    </EntryWrapper>
                ))}
                {this._renderLoaderIfNeed()}
                {this._renderPostOverlayInNeed()}
            </Root>
        );
    }

    _renderLoaderIfNeed() {
        const { isFavorite, isLoading, section, globalStatus } = this.props;

        let showLoader;

        if (isFavorite) {
            showLoader = isLoading;
        } else {
            const status = globalStatus ? globalStatus.getIn([section, 'by_author']) : null;
            showLoader = status && status.fetching;
        }

        if (showLoader) {
            return (
                <Loader>
                    <LoadingIndicator type="circle" center size={40} />
                </Loader>
            );
        }
    }

    _renderPostOverlayInNeed() {
        const { showPostPermLink } = this.state;

        if (showPostPermLink) {
            return <PostOverlay permLink={showPostPermLink} onClose={this._onOverlayClose} />;
        }
    }

    _onRef = el => {
        this._root = el;
    };

    _loadMore = () => {
        const { isFavorite } = this.props;

        if (isFavorite) {
            const { isLoading } = this.props;

            if (!isLoading) {
                this.props.loadMore();
            }
        } else {
            const { globalStatus, order, category, pageAccountName } = this.props;

            if (isFetchingOrRecentlyUpdated(globalStatus, order, category)) {
                return;
            }

            const lastPost = this.props.posts.last();
            const [author, permlink] = lastPost.split('/');

            this.props.loadMore({
                order,
                category,
                accountname: pageAccountName,
                author,
                permlink,
            });
        }
    };

    _onScroll = throttle(
        () => {
            const rect = this._root.getBoundingClientRect();

            if (rect.top + rect.height < window.innerHeight * 1.5) {
                this._loadMore();
            }
        },
        100,
        { leading: false, trailing: true }
    );

    _onResize = () => {
        const windowSizeLessThanContainer = document.documentElement.clientWidth < 1200;
        if (
            windowSizeLessThanContainer &&
            this.props.layout !== 'grid'
        ) {
            this.props.changeProfileLayout('grid');
        }
    };

    _onEntryClick = async ({ permLink, url }) => {
        window.removeEventListener('popstate', this._onPopState);
        window.removeEventListener('keydown', this._onKeyDown);
        window.addEventListener('popstate', this._onPopState);
        window.addEventListener('keydown', this._onKeyDown);

        window.history.pushState({}, '', url);

        this.props.fetchState();

        this.setState({
            showPostPermLink: permLink,
        });
    };

    _onPopState = () => {
        this._closeOverlay();
    };

    _onKeyDown = e => {
        if (e.which === keyCodes.ESCAPE) {
            this._closeOverlay();
        }
    };

    _onOverlayClose = () => {
        this._closeOverlay();
    };

    _closeOverlay() {
        if (this.state.showPostPermLink) {
            window.removeEventListener('popstate', this._onPopState);
            window.removeEventListener('keydown', this._onKeyDown);

            this.setState({
                showPostPermLink: null,
            });

            window.history.pushState({}, '', this._initialUrl);
        }
    }

    _onResizeLazy = throttle(() => {
        this.setState({
            forceGrid: window.innerWidth < FORCE_GRID_WIDTH,
        });
    }, 100);
}
