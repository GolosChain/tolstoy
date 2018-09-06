import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import VotePanel from '../../components/common/VotePanel/VotePanel';
import Icon from '../../components/golos-ui/Icon/Icon';
import ReplyBlock from '../../components/common/ReplyBlock/ReplyBlock';
import extractContent from 'app/utils/ExtractContent';
import { immutableAccessor } from '../../../../app/utils/Accessors';

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

    svg {
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
    padding-left: 13px;

    svg {
        padding: 12px 4px;
    }
`;

class ActivePanel extends Component {
    static propTypes = {};

    static defaultProps = {};

    state = {
        showPanel: true,
    };

    render() {
        const { post, onVoteChange, username } = this.props;

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
                        <Icon width="32" height="32" name="dots-more_normal"/>
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
}

const mapStateToProps = (state, props) => {
    return {};
};

const mapDispatchToProps = (dispatch, props) => {
    return {};
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ActivePanel);
