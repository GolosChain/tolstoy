import React, { Component, Fragment, createRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';
import memoize from 'lodash/memoize';
import Dropzone from 'react-dropzone';
import tt from 'counterpart';

import o2j from 'shared/clash/object2json';
import proxifyImageUrl from 'app/utils/ProxifyUrl';
import { getUserStatus } from 'src/app/helpers/users';

import Icon from 'golos-ui/Icon';
import Flex from 'golos-ui/Flex';

import VoteWitnessFollow from 'src/app/components/common/VoteWitnessFollow';
import Container from 'src/app/components/common/Container';
import UserProfileAvatar from './../UserProfileAvatar';
import Dropdown from 'src/app/components/common/Dropdown';
import DotsButton from 'src/app/components/userProfile/common/UserHeader/DotsMenu/DotsButton';

const Wrapper = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    min-height: 267px;

    &:before {
        position: absolute;
        content: '';
        height: 164px;
        left: 0;
        right: 0;
        bottom: 0;
        background-image: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0),
            rgba(0, 0, 0, 0.18) 40%,
            rgba(0, 0, 0, 0.61)
        );
    }

    @media (max-width: 768px) {
        &:before {
            height: 50%;
        }
    }

    @media (max-width: 576px) {
        min-height: 160px;

        &:before {
            display: none;
        }
    }

    ${({ backgroundUrl }) =>
        backgroundUrl
            ? `
        background-size: cover;
        background-repeat: no-repeat;
        background-position: 50%;
        background-image: url(${backgroundUrl});
        `
            : `
        background-size: 41px;
        background-repeat: repeat;
        background-position: 0 -26px;
        background-image: url('/images/profile/pattern.png');

        @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
            background-image: url('/images/profile/pattern@2x.png');
        }
        `};
`;

const ContainerWrapper = styled(Container)`
    position: relative;
    flex-direction: column;
    align-items: center;
    height: 100%;
    padding: 20px 10px;
    margin: 0 auto;

    @media (max-width: 768px) {
        padding: 90px 0 20px 0;
    }

    @media (max-width: 576px) {
        display: none;
    }
`;

const Details = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const Name = styled.div`
    display: flex;
    align-items: center;
    margin: 15px 0 5px 0;
    font-family: ${({ theme }) => theme.fontFamilySerif};
    font-size: 22px;
    font-weight: bold;
    line-height: 1;
    letter-spacing: 0.2;
    color: #ffffff;

    @media (max-width: 576px) {
        margin: 0;
        color: #333333;
    }
`;

const WitnessText = styled.span`
    margin-left: 7px;
    text-transform: capitalize;

    @media (max-width: 576px) {
        font-size: 16px;
    }
`;

const LoginContainer = styled.div`
    display: flex;
    align-items: center;
    line-height: 1.57;
    color: #ffffff;
    font-size: 14px;

    @media (max-width: 576px) {
        margin-top: 7px;
        color: #757575;
    }
`;

const Login = styled.div`
    &:not(:last-child) {
        margin-right: 22px;
    }
`;

const Buttons = styled(Flex)`
    justify-content: center;
    margin: 10px 0;

    @media (max-width: 768px) {
        margin: 16px 0 10px 0;
    }

    @media (max-width: 576px) {
        justify-content: center;
        margin: 0;
    }

    @media (max-width: 410px) {
        flex-direction: column;

        & button:first-child {
            margin: 0;
        }
        & button:last-child {
            margin-top: 10px;
        }
    }
`;

const AvatarDropzone = styled(Dropzone)`
    position: absolute !important;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
    border: none !important;
    cursor: pointer;
    background: rgba(248, 248, 248, 0.8);
    opacity: 0.5;
    transition: opacity 0.3s;

    &:hover {
        opacity: 1;
    }
`;

const DropzoneItem = styled(Dropzone)`
    width: unset;
    height: unset;
    border: none !important;
`;

const DropdownStyled = styled(Dropdown)`
    position: absolute !important;
    top: 24px;

    right: 0;
    cursor: pointer;

    @media (max-width: 768px) {
        right: 24px;
    }
`;

const IconCoverWrapper = styled.div`
    display: block;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #ffffff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.15);
`;

const IconCover = styled(Icon)`
    margin-top: 11px;
    margin-left: 11px;
    width: 20px;
    height: 20px;
`;

const IconPicture = styled(Icon)`
    color: #333333;
`;

const VoteWitnessFollowButtons = styled(VoteWitnessFollow)`
    margin-right: 0;
`;

const StatusContainer = styled.div`
    display: flex;
    align-items: center;
`;

const UserStatus = styled.p`
    margin: 0 0 0 4px;
    padding: 0;
`;

const UserProfileAvatarWrapper = styled.div`
    position: relative;

    @media (max-width: 576px) {
        width: 80px;
        height: 80px;
        margin-top: -35px;
    }
`;

const Reputation = styled.div`
    position: absolute;
    right: 7px;
    bottom: 7px;
    z-index: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 24px;
    height: 24px;
    background-color: #ffffff;
    border-radius: 50%;

    font-size: 11px;
    color: #2879ff;
    pointer-events: none;

    @media (max-width: 576px) {
        right: 2px;
        bottom: 2px;
    }
`;

const MobileUserHeader = styled.div`
    display: none;
    flex-direction: column;
    padding: 16px;
    background-color: f9f9f9;

    @media (max-width: 576px) {
        display: flex;
    }
`;

const MobileUserInfo = styled.div`
    display: flex;
    justify-content: center;

    @media (max-width: 410px) {
        flex-direction: column;
        align-items: center;
    }
`;

const MobileButtons = styled.div`
    margin-top: 16px;

    ${is('owner')`
        display: none;
    `};
`;

const MobileNameStatusWrapper = styled.div`
    display: flex;
    flex-direction: column;
    margin-left: 10px;

    @media (max-width: 410px) {
        align-items: center;
        margin: 10px 0 0 0;
    }
`;

export default class UserHeader extends Component {
    static propTypes = {
        currentAccount: PropTypes.object,
        currentUser: PropTypes.object,
        isOwner: PropTypes.bool,
        isSettingsPage: PropTypes.bool,

        uploadImage: PropTypes.func,
        updateAccount: PropTypes.func,
        notify: PropTypes.func,
    };

    dropdownRef = createRef();

    componentDidMount() {
        this.checkWitness();
    }

    checkWitness() {
        const { witnessInfo, currentAccount, checkWitness } = this.props;
        if (!witnessInfo) {
            checkWitness(currentAccount.get('name'));
        }
    }

    renderCoverDropDown() {
        const metaData = this.extractMetaData();

        return (
            <DropdownStyled
                innerRef={this.dropdownRef}
                items={[
                    {
                        title: tt('user_profile.select_image'),
                        dontCloseOnClick: true,
                        Wrapper: DropzoneItem,
                        props: {
                            onDrop: this.handleDropCover,
                            multiple: false,
                            accept: 'image/*',
                        },
                    },
                    metaData.profile.cover_image
                        ? {
                              title: `${tt('g.remove')}...`,
                              onClick: this.onRemoveCoverClick,
                          }
                        : null,
                ]}
            >
                <IconCoverWrapper data-tooltip={tt('user_profile.change_cover')}>
                    <IconCover name="picture" />
                </IconCoverWrapper>
            </DropdownStyled>
        );
    }

    getMetadata = memoize(account => {
        let metaData;
        if (account) {
            metaData = o2j.ifStringParseJSON(account.get('json_metadata'));
        }
        if (!metaData) {
            metaData = {};
        }
        if (!metaData.profile) {
            metaData.profile = {};
        }

        return metaData;
    });

    uploadDropped = (acceptedFiles, rejectedFiles, key) => {
        const { uploadImage, notify } = this.props;

        if (rejectedFiles.length) {
            notify(tt('reply_editor.please_insert_only_image_files'), 10000);
        }
        if (!acceptedFiles.length) {
            return;
        }

        const file = acceptedFiles[0];

        uploadImage(file, ({ error, url }) => {
            if (error) {
                // show error notification
                notify(error, 10000);
                return;
            }

            if (url) {
                const metaData = this.extractMetaData();

                metaData.profile[key] = url;
                this.updateMetaData(metaData);
            }
        });
    };

    onRemoveCoverClick = () => {
        const metaData = this.extractMetaData();

        delete metaData.profile.cover_image;

        this.updateMetaData(metaData);
    };

    extractMetaData() {
        const { currentAccount } = this.props;

        return this.getMetadata(currentAccount);
    }

    updateMetaData(metaData) {
        const { currentAccount, notify } = this.props;

        this.props.updateAccount({
            json_metadata: JSON.stringify(metaData),
            account: currentAccount.get('name'),
            memo_key: currentAccount.get('memo_key'),
            successCallback: () => {
                notify(tt('g.saved') + '!', 10000);
            },
            errorCallback: e => {
                if (e !== 'Canceled') {
                    notify(tt('g.server_returned_error'), 10000);
                    console.log('updateAccount ERROR', e);
                }
            },
        });
    }

    handleDropAvatar = (acceptedFiles, rejectedFiles) => {
        this.uploadDropped(acceptedFiles, rejectedFiles, 'profile_image');
    };

    handleDropCover = (acceptedFiles, rejectedFiles) => {
        this.uploadDropped(acceptedFiles, rejectedFiles, 'cover_image');
        this.dropdownRef.current.close();
    };

    renderAvatar() {
        const { isOwner, isSettingsPage, profileImg, reputation } = this.props;

        return (
            <UserProfileAvatarWrapper>
                <Reputation>{reputation}</Reputation>
                <UserProfileAvatar avatarUrl={profileImg}>
                    {isOwner && isSettingsPage && (
                        <AvatarDropzone
                            onDrop={this.handleDropAvatar}
                            multiple={false}
                            accept="image/*"
                        >
                            <IconPicture name="picture" size="20" />
                        </AvatarDropzone>
                    )}
                </UserProfileAvatar>
            </UserProfileAvatarWrapper>
        );
    }

    renderName() {
        const {
            currentUser,
            currentAccount,
            realName,
            witnessInfo,
            updateFollow,
            profileButtonsInfo,
        } = this.props;

        const isWitness = witnessInfo && witnessInfo.get('isWitness');
        const witnessText = isWitness ? `/ ${tt('g.witness')}` : null;
        const accountUsername = currentAccount.get('name');
        const authUser = currentUser.get('username');

        return (
            <Name>
                {realName}
                <WitnessText>{witnessText}</WitnessText>
                {authUser && authUser !== accountUsername && (
                    <DotsButton
                        authUser={authUser}
                        accountUsername={accountUsername}
                        updateFollow={updateFollow}
                        profileButtonsInfo={profileButtonsInfo}
                    />
                )}
            </Name>
        );
    }

    renderButtons() {
        const {
            currentUser,
            currentAccount,
            isOwner,
            witnessInfo,
            updateFollow,
            profileButtonsInfo,
            confirmUnfollowDialog,
            loginIfNeed,
            accountWitnessVote,
        } = this.props;

        const isWitness = witnessInfo && witnessInfo.get('isWitness');
        const accountUsername = currentAccount.get('name');
        const authUser = currentUser.get('username');

        return (
            <Buttons>
                {!isOwner && (
                    <Fragment>
                        {/* <Button light>
                            <Icon name="reply" height="17" width="18" />Написать
                            </Button> */}
                        <VoteWitnessFollowButtons
                            accountUsername={accountUsername}
                            authUser={authUser}
                            isWitness={isWitness}
                            profileButtonsInfo={profileButtonsInfo}
                            updateFollow={updateFollow}
                            confirmUnfollowDialog={confirmUnfollowDialog}
                            loginIfNeed={loginIfNeed}
                            accountWitnessVote={accountWitnessVote}
                        />
                    </Fragment>
                )}
            </Buttons>
        );
    }

    renderLoginContainer() {
        const { currentAccount, power } = this.props;

        const userStatus = getUserStatus(power);
        const accountUsername = currentAccount.get('name');

        return (
            <LoginContainer>
                <Login>@{accountUsername}</Login>
                {userStatus && (
                    <StatusContainer>
                        <Icon name={userStatus} width={15} height={15} />
                        <UserStatus>
                            {tt(`user_profile.account_summary.status.${userStatus}`)}
                        </UserStatus>
                    </StatusContainer>
                )}
            </LoginContainer>
        );
    }

    render() {
        const { isOwner, isSettingsPage, coverImg, currentUser, currentAccount } = this.props;

        const backgroundUrl = coverImg ? proxifyImageUrl(coverImg, '0x0') : false;

        return (
            <Fragment>
                <Wrapper backgroundUrl={backgroundUrl}>
                    <ContainerWrapper>
                        {this.renderAvatar()}
                        <Details>
                            {this.renderName()}
                            {this.renderButtons()}
                            {this.renderLoginContainer()}
                        </Details>
                        {isOwner && isSettingsPage && this.renderCoverDropDown()}
                    </ContainerWrapper>
                </Wrapper>
                <MobileUserHeader>
                    <MobileUserInfo>
                        {this.renderAvatar()}
                        <MobileNameStatusWrapper>
                            {this.renderName()}
                            {this.renderLoginContainer()}
                        </MobileNameStatusWrapper>
                    </MobileUserInfo>
                    <MobileButtons
                        owner={currentUser.get('username') === currentAccount.get('name')}
                    >
                        {this.renderButtons()}
                    </MobileButtons>
                </MobileUserHeader>
            </Fragment>
        );
    }
}
