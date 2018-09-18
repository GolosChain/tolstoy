import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import is from 'styled-is';
import VotePanel from '../../components/common/VotePanel/VotePanel';
import Icon from '../../components/golos-ui/Icon/Icon';
import ReplyBlock from '../../components/common/ReplyBlock/ReplyBlock';
import Tooltip from '../../components/post/Tooltip';
import tt from 'counterpart';
import {
    authorSelector,
    currentPostSelector,
    currentUsernameSelector,
    postSelector,
    votesSummarySelector,
} from '../../redux/selectors/post/post';
import { confirmVote } from '../../helpers/votes';
import { onVote } from '../../redux/actions/vote';

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

const CountOf = styled.div`
    padding-left: 7px;
    color: #757575;
    font-family: Roboto, sans-serif;
    font-size: 18px;
    font-weight: 300;
    letter-spacing: 1.8px;
    line-height: 23px;
`;

const SharingTriangle = Repost.extend`
    padding: 0 17px 0 7px;
`;

const DotsMore = Repost.extend`
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

ActionIcon.defaultProps = {
    width: 20,
    height: 20,
};

class ActivePanel extends Component {
    state = {
        activeDotsMore: false,
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
                    <Repost>
                        <Icon width="30" height="27" name="repost-right" />
                        <CountOf>20</CountOf>
                    </Repost>
                    <Divider />
                    <SharingTriangle>
                        <Icon width="26" height="26" name="sharing_triangle" />
                    </SharingTriangle>
                </RepostSharingWrapper>
                <Divider />
                <DotsMore isOpen={activeDotsMore}>
                    <Icon
                        width="32"
                        height="32"
                        name="dots-more_normal"
                        onClick={this._openPopover}
                    />
                    <Tooltip
                        ref={ref => (this.tooltip = ref)}
                        up={true}
                        changedIsOpen={this.toggleDots}
                    >
                        <ActionsBlock>
                            <Action onClick={this._pinPost}>
                                <ActionIcon name="pin" />
                                <ActionText>{tt('active_panel_tooltip.pin_post')}</ActionText>
                            </Action>
                            <Action onClick={this._promotePost}>
                                <ActionIcon name="brilliant" />
                                <ActionText>{tt('active_panel_tooltip.promote_post')}</ActionText>
                            </Action>
                            <Action onClick={this._flagPost}>
                                <ActionIcon name="complain_normal" />
                                <ActionText>
                                    {tt('active_panel_tooltip.complain_about_post')}
                                </ActionText>
                            </Action>
                        </ActionsBlock>
                    </Tooltip>
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

    _pinPost = () => {
        this._closePopover();
    };

    _promotePost = () => {
        this._closePopover();
    };

    _flagPost = () => {
        this._closePopover();
    };

    _openPopover = () => {
        this.tooltip.open();
    };

    _closePopover = () => {
        this.tooltip.close();
    };

    toggleDots = () => {
        this.setState({ activeDotsMore: !this.state.activeDotsMore });
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
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onVote: (voter, author, permLink, percent) => {
            dispatch(onVote(voter, author, permLink, percent));
        },
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ActivePanel);
