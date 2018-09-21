import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';
import tt from 'counterpart';

import Popover from 'golos-ui/Popover';
import Icon from 'golos-ui/Icon';

import DialogManager from 'app/components/elements/common/DialogManager';
import VotePanel from 'src/app/components/common/VotePanel/VotePanel';
import ReplyBlock from 'src/app/components/common/ReplyBlock/ReplyBlock';
import {confirmVote} from 'src/app/helpers/votes';
import {
    currentPostSelector,
    authorSelector,
    votesSummarySelector,
    postSelector
} from 'src/app/redux/selectors/post/post';
import {currentUsernameSelector} from 'src/app/redux/selectors/common';
import {onVote} from 'src/app/redux/actions/vote';
import {togglePinAction} from 'src/app/redux/actions/pinnedPosts';

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
    padding: 0 21px 0 14px;
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
    padding: 0 17px 0 7px;
`;

const DotsMore = styled(Repost)`
    position: relative;
    padding: 0 13px;

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

const ActionsBlock = styled.div`
    padding: 20px 30px;

    @media (max-width: 768px) {
        position: relative;
        max-width: calc(100vw - 60px);
        min-width: 295px;
        background: #ffffff;
        border-radius: 7px;
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

const CloseDialog = styled.div`
    position: absolute;
    top: 10px;
    right: 10px;
    display: none;
    justify-content: center;
    align-items: center;
    width: 24px;
    height: 24px;
    cursor: pointer;

    & svg {
        color: #e1e1e1;
    }

    &:hover svg {
        color: #b9b9b9;
    }

    @media (max-width: 768px) {
        display: flex;
    }
`;

const ActionsBlockHolder = ({ togglePin, promotePost, flagPost, close, ...props }) => {
    let closeDialog = close;
    if (!closeDialog) {
        closeDialog = props.onClose;
    }
    return (
        <ActionsBlock>
            <CloseDialog onClick={closeDialog}>
                <Icon name="cross" width={16} height={16} />
            </CloseDialog>
            <Action onClick={togglePin}>
                <ActionIcon name="pin" />
                <ActionText>{tt('active_panel_tooltip.pin_post')}</ActionText>
            </Action>
            <Action onClick={promotePost}>
                <ActionIcon name="brilliant" />
                <ActionText>{tt('active_panel_tooltip.promote_post')}</ActionText>
            </Action>
            <Action onClick={flagPost}>
                <ActionIcon name="complain_normal" />
                <ActionText>{tt('active_panel_tooltip.complain_about_post')}</ActionText>
            </Action>
        </ActionsBlock>
    );
};

const PopoverStyled = styled(Popover)`
    @media (max-width: 768px) {
        display: none;
    }
`;

ActionIcon.defaultProps = {
    width: 20,
    height: 20,
};

class ActivePanel extends Component {
    state = {
        activeDotsMore: false,
    };

    static propTypes = {
        isPadScreen: PropTypes.bool.isRequired,
    };

    render() {
        const { activeDotsMore } = this.state;
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
                        <Icon width="30" height="27" name="repost-right" />
                    </Repost>
                    <Divider />
                    <SharingTriangle data-tooltip={tt('postfull_jsx.share_in_social_networks')}>
                        <Icon width="26" height="26" name="sharing_triangle" />
                    </SharingTriangle>
                </RepostSharingWrapper>
                <Divider />
                <DotsMore
                    isOpen={activeDotsMore}
                    data-tooltip={activeDotsMore ? null : tt('g.next_3_strings_together.show_more')}
                >
                    <Icon
                        width="32"
                        height="32"
                        name="dots-more_normal"
                        onClick={this._openPopover}
                    />
                    <PopoverStyled
                        innerRef={this._onRef}
                        up={true}
                        handleToggleOpen={this.toggleDots}
                    >
                        <ActionsBlockHolder
                            togglePin={this._togglePin}
                            promotePost={this._promotePost}
                            flagPost={this._flagPost}
                            close={this._closePopover}
                        />
                    </PopoverStyled>
                </DotsMore>
                <ReplyBlockStyled
                    withImage={false}
                    count={data.get('children')}
                    link={data.get('link')}
                    text="Ответить"
                />
            </Wrapper>
        );
    }

    _onRef = ref => {
        this.tooltip = ref;
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
        this._closePopover();
    };

    _flagPost = () => {
        this._closePopover();
    };

    _openPopover = () => {
        if (this.props.isPadScreen) {
            this._openMobileDialog();
        } else {
            this.tooltip.open();
        }
    };

    _closePopover = () => {
        this.tooltip.close();
    };

    _togglePin = () => {
        const { account, permLink, isPinned, togglePin } = this.props;
        togglePin(account + '/' + permLink, !isPinned);
        this._closePopover();
    };

    toggleDots = () => {
        this.setState({ activeDotsMore: !this.state.activeDotsMore });
    };

    _openMobileDialog = () => {
        DialogManager.showDialog({
            component: ActionsBlockHolder,
            props: {
                togglePin: this._togglePin,
                promotePost: this._promotePost,
                flagPost: this._flagPost,
            },
        });
    };
}

const mapStateToProps = (state, props) => {
    const post = currentPostSelector(state, props);
    const author = authorSelector(state, props);
    return {
        votesSummary: votesSummarySelector(state, props),
        data: postSelector(state, props),
        username: currentUsernameSelector(state),
        permLink: post.permLink,
        account: author.account,
        isPinned: author.pinnedPostsUrls.includes(author.account + '/' + post.permLink),
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onVote: (voter, author, permLink, percent) => {
            dispatch(onVote(voter, author, permLink, percent));
        },
        togglePin: (link, isPin) => {
            dispatch(togglePinAction(link, isPin));
        },
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ActivePanel);
