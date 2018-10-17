import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { List } from 'immutable';
import throttle from 'lodash/throttle';
import styled from 'styled-components';
import is from 'styled-is';

import { saveListScrollPosition } from 'src/app/redux/actions/ui';
import { locationSelector } from 'src/app/redux/selectors/ui/location';
import { getScrollElement } from 'src/app/helpers/window';
import { isFetchingOrRecentlyUpdated } from 'app/utils/StateFunctions';

import PostCard from 'src/app/components/cards/PostCard';
import CommentCard from 'src/app/components/cards/CommentCard';
import LoadingIndicator from 'app/components/elements/LoadingIndicator';

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

@connect(
    state => ({
        location: locationSelector(state),
        listScrollPosition: state.ui.common.get('listScrollPosition'),
    }),
    {
        saveListScrollPosition,
    }
)
export default class PostsList extends PureComponent {
    static propTypes = {
        // external
        pageAccountName: PropTypes.string,
        order: PropTypes.string,
        category: PropTypes.string,
        posts: PropTypes.instanceOf(List),
        layout: PropTypes.oneOf(['list', 'grid']),
        allowInlineReply: PropTypes.bool,
        showPinButton: PropTypes.bool,

        // connect
        location: PropTypes.object,
        listScrollPosition: PropTypes.number,
    };

    static defaultProps = {
        posts: List(),
        layout: 'list',
        allowInlineReply: false,
        showPinButton: false,
    };

    state = {
        forceGrid: false,
    };

    rootRef = React.createRef();

    componentDidMount() {
        window.addEventListener('scroll', this.onScrollLazy);
        window.addEventListener('resize', this.onResizeLazy);

        const { location, listScrollPosition } = this.props;

        if (location.action === 'POP') {
            getScrollElement().scrollTop = listScrollPosition;
        }

        if (window.innerWidth < FORCE_GRID_WIDTH) {
            this.setState({
                forceGrid: true,
            });
        }
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.onScrollLazy);
        window.removeEventListener('resize', this.onResizeLazy);
        this.onResizeLazy.cancel();
        this.onScrollLazy.cancel();
    }

    onScrollLazy = throttle(
        () => {
            const rect = this.rootRef.current.getBoundingClientRect();

            if (rect.top + rect.height < window.innerHeight * 1.5) {
                this.loadMore();
            }
        },
        100,
        { leading: false, trailing: true }
    );

    onResizeLazy = throttle(() => {
        this.setState({
            forceGrid: window.innerWidth < FORCE_GRID_WIDTH,
        });
    }, 100);

    loadMore = () => {
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

    onEntryClick = () => {
        this.props.saveListScrollPosition(getScrollElement().scrollTop);
    };

    renderLoaderIfNeed() {
        const { isFavorite } = this.props; // for favorites. need to refactoring
        const { globalStatus, isLoading, category, order } = this.props;

        let showLoader;

        if (isFavorite) {
            showLoader = isLoading;
        } else {
            const status = globalStatus ? globalStatus.getIn([category || '', order]) : null;
            showLoader = (status && status.fetching) || isLoading;
        }

        if (showLoader) {
            return (
                <Loader>
                    <LoadingIndicator type="circle" center size={40} />
                </Loader>
            );
        }
    }

    render() {
        const {
            pageAccountName,
            category,
            order,
            isFavorite,
            posts,
            layout,
            allowInlineReply,
            showPinButton,
        } = this.props;

        const { forceGrid } = this.state;

        // TODO: make isPosts external prop which we need to pass to this component
        const isPosts =
            ['blog', 'feed'].includes(category) ||
            (category === '' && ['created', 'hot', 'trending', 'promoted'].includes(order)) ||
            isFavorite;

        const isGrid = isPosts && (layout === 'grid' || forceGrid);
        const EntryComponent = isPosts ? PostCard : CommentCard;

        return (
            <Root innerRef={this.rootRef} grid={isGrid}>
                {posts.map(permLink => (
                    <EntryWrapper key={permLink} grid={isGrid}>
                        <EntryComponent
                            permLink={permLink}
                            grid={isGrid}
                            allowInlineReply={allowInlineReply}
                            pageAccountName={pageAccountName}
                            showPinButton={showPinButton}
                            onClick={this.onEntryClick}
                        />
                    </EntryWrapper>
                ))}
                {this.renderLoaderIfNeed()}
            </Root>
        );
    }
}
