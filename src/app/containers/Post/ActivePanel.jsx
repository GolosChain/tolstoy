import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import VotePanel from '../../components/common/VotePanel/VotePanel';
import Icon from '../../components/golos-ui/Icon/Icon';
import ReplyBlock from '../../components/common/ReplyBlock/ReplyBlock';
import extractContent from 'app/utils/ExtractContent';
import { immutableAccessor } from '../../../../app/utils/Accessors';
import Tooltip from '../../components/post/Tooltip';

const Wrapper = styled.div`
    width: 100%;
    padding: 34px 0 30px 0;
    display: flex;
    justify-content: space-between;
`;

const HoldingBlock = styled.div`
    display: flex;
    align-items: center;
`;

const Divider = styled.div`
    width: 1px;
    height: 26px;
    background: #e1e1e1;
`;

const VotePanelStyled = styled(VotePanel)`
    padding: 12px 22px 12px 0;
`;

const Repost = styled.div`
    padding: 0 21px 0 14px;
    display: flex;
    align-items: center;

    & > svg {
        padding: 4px;
        cursor: pointer;
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
`;

const MoreFunctions = styled.div`
    padding: 20px 30px;
`;

const MoreFunction = styled.div`
    display: flex;
    align-items: center;

    svg {
        min-width: 20px;
        min-height: 20px;
        padding: 0;
    }
`;

const MoreFunctionText = styled.div`
    margin-left: 25px;
    color: #333333;
    font-family: Roboto, sans-serif;
    font-size: 14px;
    line-height: 44px;
    white-space: nowrap;
    cursor: pointer;
`;

class ActivePanel extends Component {
    static propTypes = {
        username: PropTypes.string,
        post: PropTypes.shape({
            tags: PropTypes.arrayOf(PropTypes.string).isRequired,
            payout: PropTypes.number.isRequired,
            category: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
            body: PropTypes.string.isRequired,
            created: PropTypes.any.isRequired,
            pictures: PropTypes.bool.isRequired,
            jsonMetadata: PropTypes.string,
            author: PropTypes.string.isRequired,
            isFavorite: PropTypes.bool.isRequired,
        }).isRequired,
        onVoteChange: PropTypes.func.isRequired,
    };

    state = {
        showPanel: true,
        activeDotsMore: false,
    };

    render() {
        const { post, onVoteChange, username, tooltipActions } = this.props;

        return (
            <Wrapper>
                <HoldingBlock>
                    <VotePanelStyled
                        data={post.data}
                        me={username}
                        whiteTheme={false}
                        onChange={onVoteChange}
                    />
                    <Divider />
                    <Repost>
                        <Icon width="30" height="27" name="repost-right" />
                        <CountOf>20</CountOf>
                    </Repost>
                    <Divider />
                    <SharingTriangle>
                        <Icon width="26" height="26" name="sharing_triangle" />
                    </SharingTriangle>
                    <Divider />
                    <DotsMore>
                        <Icon
                            width="32"
                            height="32"
                            name={
                                this.state.activeDotsMore ? 'dots-more_pressed' : 'dots-more_normal'
                            }
                            onClick={this._openPopover}
                        />
                        <Tooltip
                            ref={ref => (this.tooltip = ref)}
                            up={true}
                            changedIsOpen={this.toggleDots}
                        >
                            <MoreFunctions>
                                {tooltipActions.map((action, index) => {
                                    return (
                                        <MoreFunction key={index}>
                                            <Icon width="20" height="20" name={action.icon} />
                                            <MoreFunctionText>{action.name}</MoreFunctionText>
                                        </MoreFunction>
                                    );
                                })}
                            </MoreFunctions>
                        </Tooltip>
                    </DotsMore>
                </HoldingBlock>
                <HoldingBlock>
                    <ReplyBlock
                        withImage={false}
                        count={post.children}
                        link={post.link}
                        text="Ответить"
                    />
                </HoldingBlock>
            </Wrapper>
        );
    }

    _openPopover = e => {
        e.stopPropagation();
        this.tooltip.open();
    };

    toggleDots = () => {
        this.setState({ activeDotsMore: !this.state.activeDotsMore });
    };
}

const mapStateToProps = (state, props) => {
    const tooltipActions = [
        { name: 'Закрепить пост', icon: 'pin' },
        { name: 'Продвинуть пост', icon: 'brilliant' },
        { name: 'Пожаловаться на пост', icon: 'complain_normal' },
    ];
    return { tooltipActions };
};

const mapDispatchToProps = (dispatch, props) => {
    return {};
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ActivePanel);
