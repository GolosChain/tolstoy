import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Userpic from '../../../../app/components/elements/Userpic';
import { Link } from 'react-router';
import tt from 'counterpart';
import Icon from '../../components/golos-ui/Icon/Icon';
import Button from '../../components/golos-ui/Button/Button';
import ToggleFollowButton from '../../components/common/ToggleFollowButton';
import { authorSelector } from '../../redux/selectors/post/post';
import JoinedToGolos from '../../components/common/JoinedToGolos';

const Wrapper = styled.div`
    display: flex;
    padding: 20px;
    border-radius: 8px;
    background-color: #ffffff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);

    @media (max-width: 768px) {
        flex-direction: column;
    }
`;

const AvatarBlock = styled.div`
    display: flex;
    align-items: center;
    flex-grow: 1;
    padding-left: 20px;

    @media (max-width: 768px) {
        padding-left: 0;
    }
`;

const NamesWrapper = styled.div`
    padding: 0 20px 0 10px;
`;

const RealName = styled.div`
    color: #393636;
    font-family: 'Open Sans', sans-serif;
    font-size: 24px;
    font-weight: bold;
    line-height: 25px;
`;

const UserName = styled(Link)`
    display: inline-block;
    padding: 0 10px;
    margin-left: -10px;
    color: #959595;
    font-family: 'Open Sans', sans-serif;
    font-size: 12px;
    line-height: 25px;
`;

const Divider = styled.div`
    width: 1px;
    height: 89px;
    background: #e1e1e1;

    @media (max-width: 768px) {
        display: none;
    }
`;

const CakeBlock = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    flex-grow: 2;
    
    @media (max-width: 768px) {
        display: none;
    }
`;

const CakeText = styled.div`
    padding-top: 14px;
    color: #959595;
    font-family: 'Open Sans', sans-serif;
    font-size: 16px;
    letter-spacing: -0.26px;
    line-height: 24px;
`;

const ButtonsBlock = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    flex-direction: column;
    flex-grow: 1;
`;

const ButtonInPanel = Button.extend`
    min-width: 167px;

    @media (max-width: 768px) {
        width: 100%;
        margin-top: 20px;
    }
`;

const ToggleFollowButtonWrapper = styled(ToggleFollowButton)`
    min-width: 167px;
    min-height: 34px;

    @media (max-width: 768px) {
        width: 100%;
        margin-top: 20px;
    }
`;

const AboutTextMobile = styled.p`
    display: none;
    margin: 20px 0 0 0;
    color: #959595;
    font-family: 'Open Sans', sans-serif;
    font-size: 16px;
    letter-spacing: -0.26px;
    line-height: 24px;
    
    @media (max-width: 768px) {
        display: block
    }
`;

class AboutPanel extends Component {
    static propTypes = {
        follow: PropTypes.func.isRequired,
        unfollow: PropTypes.func.isRequired,
    };

    render() {
        const { name, account, isFollow, follow, unfollow } = this.props;
        const accountData = accounts.get(accountUsername).toJS();
        return (
            <Wrapper>
                <AvatarBlock>
                    <Userpic account={account} size={50} />
                    <NamesWrapper>
                        <RealName>{name}</RealName>
                        <UserName to={`/@${account}`}>@{account}</UserName>
                    </NamesWrapper>
                    <Divider />
                </AvatarBlock>
                <AboutTextMobile>{author.about}</AboutTextMobile>
                <CakeBlock>
                    <Icon width="36" height="34" name="cake" />
                    <CakeText>
                        {tt('on_golos_from')} <JoinedToGolos date={accountData.created} />
                    </CakeText>
                </CakeBlock>
                <ButtonsBlock>
                    <ButtonInPanel light>
                        <Icon width="17" height="15" name="coins_plus" />
                        отблагодарить
                    </ButtonInPanel>
                    <ToggleFollowButtonWrapper
                        isFollow={isFollow}
                        followUser={follow}
                        unfollowUser={unfollow}
                    />
                </ButtonsBlock>
            </Wrapper>
        );
    }
}

const mapStateToProps = (state, props) => {
    const author = authorSelector(state, props);
    return {
        name: author.name,
        account: author.account,
        isFollow: author.isFollow,
    };
};

const mapDispatchToProps = dispatch => {
    return {};
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AboutPanel);
