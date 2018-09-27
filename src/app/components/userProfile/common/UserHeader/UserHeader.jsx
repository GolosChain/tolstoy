import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import tt from 'counterpart';
import o2j from 'shared/clash/object2json';
import proxifyImageUrl from 'app/utils/ProxifyUrl';
import normalizeProfile from 'app/utils/NormalizeProfile';

import Dropzone from 'react-dropzone';
import { BaseButton } from 'golos-ui/Button';
import Icon from 'golos-ui/Icon';
import Flex from 'golos-ui/Flex';

import Follow from 'src/app/components/common/FollowMute';
import Mute from 'src/app/components/common/Mute';
import StyledContainer from 'src/app/components/common/Container';
import UserProfileAvatar from './../UserProfileAvatar';

// Styled Components
const Wrapper = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    min-height: 207px;

    &:before {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        background-color: rgba(255, 255, 255, 0.25);
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

const Container = StyledContainer.extend`
    position: relative;

    @media (max-width: 768px) {
        flex-direction: column;
        margin: 19px 10px 23px;
    }

    @media (max-width: 1200px) {
        margin-top: 23px;
        margin-bottom: 23px;
    }
`;

const Details = styled.div`
    margin-left: 28px;

    @media (max-width: 768px) {
        margin-top: 9px;
        margin-left: 0;
        text-align: center;
    }
`;

const Name = styled.div`
    color: #393636;
    font-family: ${({ theme }) => theme.fontFamilySerif};
    font-size: 30px;
    font-weight: bold;
    line-height: 1;
    mix-blend-mode: multiply;

    @media (max-width: 768px) {
        font-size: 34px;
    }
`;

const Login = styled.div`
    color: #757575;
    font-family: 'Helvetica Neue';
    font-size: 20px;
    line-height: 1;
    margin-top: 6px;
    mix-blend-mode: difference;

    @media (max-width: 768px) {
        font-size: 14px;
        margin-top: 0;
    }
`;

const Buttons = styled(Flex)`
    margin-top: 24px;

    @media (max-width: 768px) {
        margin-top: 16px;
    }
`;

const ButtonLink = BaseButton.withComponent('a');

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
    opacity: 0;
    transition: opacity 0.5s;

    &:hover {
        opacity: 1;
        transition-delay: 0.2s;
    }
`;

const IconCover = styled(Dropzone)`
    position: absolute !important;
    top: 9px;
    right: 5px;
    overflow: hidden;
    cursor: pointer;
`;

const IconPicture = styled(Icon)`
    color: #333;
`;

const ButtonFollow = styled(Follow)`
    margin-right: 5px;
`;

const ButtonMute = styled(Mute)`
    margin-right: 5px;
`;

// Component
export default class UserHeader extends Component {
    static propTypes = {
        currentAccount: PropTypes.object,
        currentUser: PropTypes.object,
        isOwner: PropTypes.bool,

        uploadImage: PropTypes.func,
        updateAccount: PropTypes.func,
        notify: PropTypes.func,
    };

    dropzoneAvatar = null;
    dropzoneCover = null;

    uploadDropped = (acceptedFiles, rejectedFiles, key) => {
        const { currentAccount, uploadImage, updateAccount, notify } = this.props;

        const metaData = currentAccount
            ? o2j.ifStringParseJSON(currentAccount.get('json_metadata'))
            : {};
        const profile = metaData && metaData.profile ? metaData.profile : {};

        if (rejectedFiles.length) {
            notify(tt('reply_editor.please_insert_only_image_files'), 10000);
        }

        if (!acceptedFiles.length) return;

        const file = acceptedFiles[0];
        uploadImage(file, ({ error, url }) => {
            if (error) {
                // show error notification
                notify(error, 10000);
                return;
            }

            if (url) {
                profile[key] = url;

                updateAccount({
                    json_metadata: JSON.stringify({ profile }),
                    account: currentAccount.get('name'),
                    memo_key: currentAccount.get('memo_key'),
                    errorCallback: e => {
                        if (e !== 'Canceled') {
                            notify(tt('g.server_returned_error'), 10000);
                            console.log('updateAccount ERROR', e);
                        }
                    },
                    successCallback: () => {
                        notify(tt('g.saved') + '!', 10000);
                    },
                });
            }
        });
    };

    handleDropAvatar = (acceptedFiles, rejectedFiles) => {
        this.uploadDropped(acceptedFiles, rejectedFiles, 'profile_image');
    };

    handleDropCover = (acceptedFiles, rejectedFiles) => {
        this.uploadDropped(acceptedFiles, rejectedFiles, 'cover_image');
    };

    render() {
        const { currentAccount, currentUser, isOwner } = this.props;
        const { name, profile_image, cover_image } = normalizeProfile(currentAccount.toJS());

        const backgroundUrl = cover_image ? proxifyImageUrl(cover_image, '0x0') : false;

        return (
            <Wrapper backgroundUrl={backgroundUrl}>
                <Container align="center">
                    <UserProfileAvatar avatarUrl={profile_image}>
                        {isOwner && (
                            <AvatarDropzone
                                ref={r => (this.dropzoneAvatar = r)}
                                onDrop={this.handleDropAvatar}
                                multiple={false}
                                accept="image/*"
                            >
                                <IconPicture name="picture" size="20" />
                            </AvatarDropzone>
                        )}
                    </UserProfileAvatar>
                    <Details>
                        {name ? <Name>{name}</Name> : null}
                        <Login>@{currentAccount.get('name')}</Login>
                        <Buttons>
                            {!isOwner && (
                                <Fragment>
                                    {/* <Button light>
                                    <Icon name="reply" height="17" width="18" />Написать
                                    </Button> */}
                                    <ButtonFollow
                                        following={currentAccount.get('name')}
                                    />
                                    <ButtonMute
                                        muting={currentAccount.get('name')}
                                    />
                                </Fragment>
                            )}
                            <ButtonLink light href={`https://preview.golos.io/@${currentAccount.get('name')}`}>
                                Вернуть старый профиль
                            </ButtonLink>
                        </Buttons>

                    </Details>
                    {isOwner && (
                        <IconCover
                            ref={r => (this.dropzoneCover = r)}
                            onDrop={this.handleDropCover}
                            multiple={false}
                            accept="image/*"
                        >
                            <Icon name="picture" size="20" />
                        </IconCover>
                    )}
                </Container>
            </Wrapper>
        );
    }
}
