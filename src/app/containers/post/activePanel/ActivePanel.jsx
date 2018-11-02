import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import is from 'styled-is';
import tt from 'counterpart';
import PropTypes from 'prop-types';

import Icon from 'golos-ui/Icon';

import VotePanel from 'src/app/components/common/VotePanel';
import ReplyBlock from 'src/app/components/common/ReplyBlock';
import SharePopover from 'src/app/components/post/SharePopover';
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
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
        grid-template-rows: 1fr 1fr;
        grid-template-areas:
            'vpw vpm vpm vpm vpm dm'
            'rsw rsw . . rbs rbs';
        overflow: hidden;
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
    padding: 12px 22px 12px 0;

    @media (max-width: 768px) {
        display: -webkit-box;
        padding-left: 14px;
        grid-area: vpw;
    }
`;

const Repost = styled.div`
    padding: 0 19px;
    display: flex;
    align-items: center;

    & > svg {
        cursor: pointer;
        padding: 4px;
        transition: 0.2s;

        &:hover {
            transform: scale(1.15);
        }
    }

    @media (max-width: 768px) {
        padding-left: 13px;
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

const StyledPostActions = styled(PostActions)`
    transition: none;

    &:hover {
        transform: none;
        color: #2879ff !important;
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

        const shareTooltip = showSharePopover ? undefined : tt('postfull_jsx.share_in_social_networks');
        const dotsTooltip = showDotsPopover ? undefined : tt('g.next_3_strings_together.show_more');

        return (
            <Wrapper>
                <VotePanelWrapper contentLink={`${data.get('author')}/${data.get('permlink')}`} />
                <Divider />
                <RepostSharingWrapper>
                    {isOwner ? null : (
                        <Fragment>
                            <Repost data-tooltip={tt('g.reblog')} aria-label={tt('g.reblog')}>
                                <Icon width="30" height="27" name="repost" onClick={this.repost} />
                            </Repost>
                            <Divider />
                        </Fragment>
                    )}
                    <SharingTriangle
                        isOpen={showSharePopover}
                        data-tooltip={shareTooltip}
                        aria-label={shareTooltip}
                    >
                        <PopoverBackgroundShade show={showSharePopover} />
                        <Icon
                            width="26"
                            height="26"
                            name="sharing_triangle"
                            onClick={this.openSharePopover}
                        />
                        <PopoverStyled
                            position="top"
                            onClose={this.closeSharePopover}
                            show={showSharePopover}
                        >
                            <SharePopover horizontal={true} post={post} />
                        </PopoverStyled>
                    </SharingTriangle>
                </RepostSharingWrapper>
                <Divider />
                <DotsMore
                    isOpen={showDotsPopover}
                    data-tooltip={dotsTooltip}
                    aria-label={dotsTooltip}
                >
                    <PopoverBackgroundShade show={showDotsPopover} />
                    <Icon
                        width="32"
                        height="32"
                        name="dots-more_normal"
                        onClick={this.openDotsPopover}
                    />
                    <PopoverStyled
                        position="top"
                        onClose={this.closeDotsPopover}
                        show={showDotsPopover}
                    >
                        <Actions>
                            <StyledPostActions
                                fullUrl={post.url}
                                isFavorite={post.isFavorite}
                                isPinned={isPinned}
                                isOwner={isOwner}
                                toggleFavorite={toggleFavorite}
                                togglePin={togglePin}
                                showText
                            />
                            {username ? (
                                <Action
                                    onClick={this.promotePost}
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
                <ReplyBlockStyled
                    withImage={false}
                    count={post.children}
                    link={post.url}
                    text={tt('g.reply')}
                />
            </Wrapper>
        );
    }
}
