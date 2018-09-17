import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Userpic from '../../../../app/components/elements/Userpic';
import { Link } from 'react-router';
import { Map } from 'immutable';
import Icon from '../../components/golos-ui/Icon/Icon';
import Button from '../../components/golos-ui/Button/Button';
import ToggleFollowButton from '../../components/common/ToggleFollowButton';
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

const AboutText = styled.p`
    margin: 20px 0 0 0;
    color: #959595;
    font-family: 'Open Sans', sans-serif;
    font-size: 16px;
    letter-spacing: -0.26px;
    line-height: 24px;
`;

class AboutPanel extends Component {
    static propTypes = {
        author: PropTypes.shape({
            name: PropTypes.string,
            account: PropTypes.string.isRequired,
            about: PropTypes.string.isRequired,
            isFollow: PropTypes.bool.isRequired,
            follow: PropTypes.func.isRequired,
            unfollow: PropTypes.func.isRequired,
        }).isRequired,
        accounts: PropTypes.instanceOf(Map),
        isiPadScreen: PropTypes.bool.isRequired,
    };

    render() {
        const { author, accounts, isiPadScreen } = this.props;
        const accountUsername = author.account;
        const accountData = accounts.get(accountUsername).toJS();

        return (
            <Wrapper>
                <AvatarBlock>
                    <Userpic account={accountUsername} size={50} />
                    <NamesWrapper>
                        <RealName>{author.name}</RealName>
                        <UserName to={`/@${accountUsername}`}>@{accountUsername}</UserName>
                    </NamesWrapper>
                    <Divider />
                </AvatarBlock>
                {isiPadScreen ? (
                    <AboutText>{author.about}</AboutText>
                ) : (
                    <CakeBlock>
                        <Icon width="36" height="34" name="cake" />
                        <CakeText>
                            На Golos с <JoinedToGolos date={accountData.created} />
                        </CakeText>
                    </CakeBlock>
                )}
                <ButtonsBlock>
                    <ButtonInPanel light>
                        <Icon width="17" height="15" name="coins_plus" />
                        отблагодарить
                    </ButtonInPanel>
                    <ToggleFollowButtonWrapper
                        isFollow={author.isFollow}
                        followUser={author.follow}
                        unfollowUser={author.unfollow}
                    />
                </ButtonsBlock>
            </Wrapper>
        );
    }
}

export default AboutPanel;
