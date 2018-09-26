import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import is from 'styled-is';
import tt from 'counterpart';

import Icon from 'golos-ui/Icon';

import VotePanel from 'src/app/components/common/VotePanel/VotePanel';
import ReplyBlock from 'src/app/components/common/ReplyBlock/ReplyBlock';
import { confirmVote } from 'src/app/helpers/votes';
import { onVote } from 'src/app/redux/actions/vote';
import { togglePinAction } from 'src/app/redux/actions/pinnedPosts';
import { activePanelSelector } from 'src/app/redux/selectors/post/activePanel';
import { reblog } from 'src/app/redux/actions/posts';
import {
    PopoverBackgroundShade,
    ClosePopoverButton,
    PopoverStyled,
} from 'src/app/components/post/PopoverAdditionalStyles';
import SharePopover from 'src/app/containers/post/SharePopover';

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
            color: #2578be;
        }
    `};
`;

const DotsMore = styled(Repost)`
    position: relative;
    padding: 0 18px;

    svg {
        padding: 12px 4px;
    }

    ${is('isOpen')`
        & > svg {
            transition: color 0s;
            color: #2578be;
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
    color: #333333;
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

@connect(
    activePanelSelector,
    {
        onVote,
        togglePinAction,
        reblog,
        showPromotePost: (author, permlink) => ({
            type: 'global/SHOW_DIALOG',
            payload: { name: 'promotePost', params: { author, permlink } },
        }),
    }
)
export default class ActivePanel extends Component {
    state = {
        activeDotsMore: false,
        activeShareMore: false,
    };

    render() {
        const { activeDotsMore, activeShareMore } = this.state;
        const { data, username } = this.props;
        return (
            <Wrapper>
                <VotePanelWrapper
                    data={data}
                    me={username}
                    whiteTheme={false}
                    onChange={this._voteChange}
                />
                <Divider />
                <RepostSharingWrapper>
                    <Repost data-tooltip={tt('g.reblog')}>
                        <Icon width="30" height="27" name="repost-right" onClick={this._reblog} />
                    </Repost>
                    <Divider />
                    <SharingTriangle
                        isOpen={activeShareMore}
                        data-tooltip={
                            activeShareMore
                                ? undefined
                                : tt('postfull_jsx.share_in_social_networks')
                        }
                    >
                        <PopoverBackgroundShade show={activeShareMore} />
                        <Icon
                            width="26"
                            height="26"
                            name="sharing_triangle"
                            onClick={this._openSharePopover}
                        />
                        <PopoverStyled
                            innerRef={this._onShareRef}
                            position="top"
                            onToggleOpen={this.toggleShare}
                        >
                            <SharePopover horizontal={true} />
                        </PopoverStyled>
                    </SharingTriangle>
                </RepostSharingWrapper>
                <Divider />
                <DotsMore
                    isOpen={activeDotsMore}
                    data-tooltip={activeDotsMore ? null : tt('g.next_3_strings_together.show_more')}
                >
                    <PopoverBackgroundShade show={activeDotsMore} />
                    <Icon
                        width="32"
                        height="32"
                        name="dots-more_normal"
                        onClick={this._openDotsPopover}
                    />
                    <PopoverStyled
                        innerRef={this._onDotsRef}
                        position="top"
                        onToggleOpen={this.toggleDots}
                    >
                        <Actions>
                            <ClosePopoverButton onClick={this._closeDotsPopover} showCross={false}>
                                <Icon name="cross" width={16} height={16} />
                            </ClosePopoverButton>
                            <Action onClick={this._togglePin}>
                                <ActionIcon name="pin" />
                                <ActionText>{tt('active_panel_tooltip.pin_post')}</ActionText>
                            </Action>
                            <Action onClick={this._promotePost}>
                                <ActionIcon name="brilliant" />
                                <ActionText>{tt('active_panel_tooltip.promote_post')}</ActionText>
                            </Action>
                            {/*TODO после реализации функционала
                            <Action onClick={this._flagPost}>
                                <ActionIcon name="complain_normal" />
                                <ActionText>{tt('active_panel_tooltip.complain_about_post')}</ActionText>
                            </Action>*/}
                        </Actions>
                    </PopoverStyled>
                </DotsMore>
                <ReplyBlockStyled
                    withImage={false}
                    count={data.get('children')}
                    link={data.get('link')}
                    text={tt('g.reply')}
                />
            </Wrapper>
        );
    }

    _onShareRef = ref => {
        this.shareRef = ref;
    };

    _onDotsRef = ref => {
        this.dotsRef = ref;
    };

    _voteChange = async percent => {
        const {
            votesSummary: { myVote },
            username,
            permLink,
            account,
        } = this.props;
        if (await confirmVote(myVote, percent)) {
            this.props.onVote(username, account, permLink, percent);
        }
    };

    _promotePost = () => {
        const { account, permLink } = this.props;
        this.props.showPromotePost(account, permLink);
        this._closeDotsPopover();
    };

    _flagPost = () => {
        this._closeDotsPopover();
    };

    _openSharePopover = () => {
        this.shareRef.open();
    };

    _closeSharePopover = () => {
        this.shareRef.close();
    };

    _openDotsPopover = () => {
        this.dotsRef.open();
    };

    _closeDotsPopover = () => {
        this.dotsRef.close();
    };

    _reblog = () => {
        const { username, account, permLink } = this.props;
        this.props.reblog(username, account, permLink);
    };

    _togglePin = () => {
        const { account, permLink, isPinned, togglePinAction } = this.props;
        togglePinAction(account + '/' + permLink, !isPinned);
        this._closeDotsPopover();
    };

    toggleDots = () => {
        this.setState({ activeDotsMore: !this.state.activeDotsMore });
    };

    toggleShare = () => {
        this.setState({ activeShareMore: !this.state.activeShareMore });
    };
}
