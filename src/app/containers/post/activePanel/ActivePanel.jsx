import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import is from 'styled-is';
import tt from 'counterpart';
import PropTypes from 'prop-types';

import Icon from 'golos-ui/Icon';

import VotePanel from 'src/app/components/common/VotePanel';
import ReplyBlock from 'src/app/components/common/ReplyBlock';
import ShareList from 'src/app/components/post/ShareList';
import {
    PopoverBackgroundShade,
    PopoverStyled,
} from 'src/app/components/post/PopoverAdditionalStyles';
import PostActions from 'src/app/components/post/PostActions';

const Wrapper = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
    padding: 34px 0 30px 0;

    @media (max-width: 768px) {
        display: grid;
        padding: 2px 0 0;
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
        grid-template-rows: 1fr 1px 1fr;
        grid-template-areas:
            'vpw vpw vpw vpw vpw dm'
            'spl spl spl spl spl spl'
            'rsw rsw . . rbs rbs';

        &::after {
            content: '';
            display: block;
            grid-area: spl;
            width: 100%;
            margin-top: 2px;
            border-top: 1px solid #e1e1e1;
        }
    }

    @media (max-width: 360px) {
        max-width: 100%;
    }
`;

const Divider = styled.div`
    width: 1px;
    height: 26px;
    background: #e1e1e1;

    @media (max-width: 768px) {
        display: none;
    }
`;

const VotePanelWrapper = styled(VotePanel)`
    padding: 0 22px 0 18px;

    @media (max-width: 768px) {
        display: -webkit-box;
        grid-area: vpw;
    }

    @media (max-width: 360px) {
        padding: 12px 10px;
    }
`;

const Repost = styled.div`
    padding: 0 18px;
    display: flex;
    align-items: center;

    & > svg {
        cursor: pointer;
        padding: 4px;
        transition: transform 0.2s ease;

        &:hover {
            transform: scale(1.15);
        }
    }

    @media (max-width: 360px) {
        padding-left: 10px;
    }
`;

const SharingTriangle = styled(Repost)`
    position: relative;
    padding: 0 12px;

    ${is('isOpen')`
        & > svg {
            transition: color 0s;
            color: #2879ff;
        }
    `};
`;

const DotsMore = styled(Repost)`
    position: relative;
    padding: 0 18px;

    & > ${Icon} {
        padding: 12px 4px;
    }

    ${is('isOpen')`
        & > ${Icon} {
            transition: color 0s;
            color: #2879ff;
        }
    `};

    @media (max-width: 768px) {
        grid-area: dm;
        justify-self: end;
    }

    @media (max-width: 360px) {
        padding: 0 5px;
    }
`;

const Action = styled.div`
    display: flex;
    align-items: center;
    cursor: pointer;

    &:hover {
        color: #2879ff;
    }

    svg {
        min-width: 20px;
        min-height: 20px;
        padding: 0;
    }
`;

const ActionText = styled.div`
    margin-left: 25px;
    font-family: Roboto, sans-serif;
    font-size: 14px;
    line-height: 44px;
    white-space: nowrap;
    cursor: pointer;
`;

const ActionIcon = styled(Icon)``;

const ReplyBlockStyled = styled(ReplyBlock)`
    margin-left: auto;

    @media (max-width: 768px) {
        margin-left: 0;
        justify-self: end;
        grid-area: rbs;
    }
`;

const RepostSharingWrapper = styled.div`
    display: flex;

    @media (max-width: 768px) {
        margin-left: -2px;
        grid-area: rsw;
    }
`;

const Actions = styled.div`
    padding: 20px 30px;

    @media (max-width: 768px) {
        position: relative;
        max-width: calc(100vw - 60px);
        min-width: 295px;
        background: #ffffff;
        border-radius: 7px;
    }
`;

ActionIcon.defaultProps = {
    width: 20,
    height: 20,
};

export class ActivePanel extends Component {
    static propTypes = {
        togglePin: PropTypes.func.isRequired,
        toggleFavorite: PropTypes.func.isRequired,
    };

    state = {
        showDotsPopover: false,
        showSharePopover: false,
    };

    promotePost = () => {
        const { account, permLink } = this.props;
        this.props.openPromoteDialog(`${account}/${permLink}`);
    };

    openSharePopover = () => {
        this.setState({
            showSharePopover: true,
        });
    };

    closeSharePopover = () => {
        this.setState({
            showSharePopover: false,
        });
    };

    openDotsPopover = () => {
        this.setState({
            showDotsPopover: true,
        });
    };

    closeDotsPopover = () => {
        this.setState({
            showDotsPopover: false,
        });
    };

    repost = () => {
        const { account, permLink } = this.props;
        this.props.openRepostDialog(`${account}/${permLink}`);
    };

    render() {
        const { showDotsPopover, showSharePopover } = this.state;
        const { post, data, username, isPinned, togglePin, isOwner, toggleFavorite } = this.props;

        const shareTooltip = showSharePopover
            ? undefined
            : tt('postfull_jsx.share_in_social_networks');
        const dotsTooltip = showDotsPopover ? undefined : tt('g.show_more_2');

        return (
            <Wrapper>
                <VotePanelWrapper contentLink={`${data.get('author')}/${data.get('permlink')}`} />
                <Divider />
                <RepostSharingWrapper>
                    {isOwner ? null : (
                        <Fragment>
                            <Repost
                                role="button"
                                data-tooltip={tt('g.repost')}
                                aria-label={tt('g.repost')}
                            >
                                <Icon width="30" height="27" name="repost" onClick={this.repost} />
                            </Repost>
                            <Divider />
                        </Fragment>
                    )}
                    <SharingTriangle
                        isOpen={showSharePopover}
                        role="button"
                        data-tooltip={shareTooltip}
                        aria-label={shareTooltip}
                    >
                        <PopoverBackgroundShade
                            show={showSharePopover}
                            onClick={this.closeSharePopover}
                        />
                        <Icon
                            width="26"
                            height="26"
                            name="sharing_triangle"
                            onClick={this.openSharePopover}
                        />
                        <PopoverStyled
                            position="top"
                            closePopover={this.closeSharePopover}
                            show={showSharePopover}
                        >
                            <ShareList horizontal={true} post={post} />
                        </PopoverStyled>
                    </SharingTriangle>
                </RepostSharingWrapper>
                <Divider />
                <DotsMore
                    isOpen={showDotsPopover}
                    role="button"
                    data-tooltip={dotsTooltip}
                    aria-label={dotsTooltip}
                >
                    <PopoverBackgroundShade
                        show={showDotsPopover}
                        onClick={this.closeDotsPopover}
                    />
                    <Icon
                        width="32"
                        height="32"
                        name="dots-more_normal"
                        onClick={this.openDotsPopover}
                    />
                    <PopoverStyled
                        position="top"
                        closePopover={this.closeDotsPopover}
                        show={showDotsPopover}
                    >
                        <Actions>
                            <PostActions
                                fullUrl={post.url}
                                isFavorite={post.isFavorite}
                                isPinned={isPinned}
                                isOwner={isOwner}
                                toggleFavorite={toggleFavorite}
                                togglePin={togglePin}
                                coloredOnHover
                                showText
                            />
                            {username ? (
                                <Action
                                    onClick={this.promotePost}
                                    role="button"
                                    aria-label={tt('active_panel_tooltip.promote_post')}
                                >
                                    <ActionIcon name="brilliant" />
                                    <ActionText>
                                        {tt('active_panel_tooltip.promote_post')}
                                    </ActionText>
                                </Action>
                            ) : null}
                        </Actions>
                    </PopoverStyled>
                </DotsMore>
                <ReplyBlockStyled count={post.children} link={post.url} text={tt('g.reply')} />
            </Wrapper>
        );
    }
}
