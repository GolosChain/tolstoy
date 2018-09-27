import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';
import { Link } from 'react-router';

import tt from 'counterpart';
import { FormattedDate } from 'react-intl';

import { repLog10 } from 'app/utils/ParsersAndFormatters';
import normalizeProfile from 'app/utils/NormalizeProfile';
import { makeSocialLink, makeLeaveLink } from 'src/app/helpers/urls';

import Icon from 'golos-ui/Icon';
import { CardTitle } from 'golos-ui/Card';
import CollapsingCard from 'golos-ui/CollapsingCard';

import DialogManager from 'app/components/elements/common/DialogManager';
import FollowersDialog from 'src/app/components/userProfile/dialogs/FollowersDialog';

const CollapsingCardStyled = styled(CollapsingCard)`
    margin-bottom: 18px;
    border-radius: 8px;

    @media (max-width: 890px) {
        border-radius: 0;
    }
`;

const CardContent = styled.div`
    display: flex;
    flex-direction: column;
    margin: 17px 20px;
`;

const CardContentCounters = styled(CardContent)`
    margin: 0;
`;

const Row = styled.div`
    position: relative;
    display: flex;
    height: 70px;

    &:not(:last-of-type) {
        margin-top: 1px;

        &:after {
            content: '';
            position: absolute;
            bottom: -1px;
            left: 20px;
            right: 20px;
            height: 1px;
            background: #e1e1e1;
        }
    }
`;

const Column = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    justify-content: center;
    align-items: center;
    text-align: center;
    position: relative;

    &:first-of-type {
        margin-right: -1px;

        &:after {
            content: '';
            position: absolute;
            top: 10px;
            bottom: 10px;
            right: 0;
            width: 1px;
            background: #e1e1e1;
        }
    }
`;

const ColumnClick = styled(Column)`
    cursor: pointer;
`;

const Bold = styled.div`
    display: flex;
    align-items: center;
    color: #333;
    font-family: ${({ theme }) => theme.fontFamily};
    font-size: 17px;
    font-weight: bold;
    line-height: 1;
    margin-bottom: 5px;
`;

const Title = styled.div`
    color: #393636;
    font-family: ${({ theme }) => theme.fontFamily};
    font-size: 14px;
    font-weight: 300;
    line-height: 1;
`;

const UserCardCity = styled.div`
    color: #393636;
    font-family: ${({ theme }) => theme.fontFamily};
    font-size: 13px;
    font-weight: 400;
    line-height: 1;
    text-transform: initial;
`;

const UserCardSite = styled.a`
    color: #2879ff;
    font-family: 'Open Sans', sans-serif;
    font-size: 14px;
    letter-spacing: 0.25px;
    line-height: 1;
    margin-bottom: 12px;
    text-decoration: underline;
`;
const UserCardBio = styled.div`
    font-family: 'Open Sans', sans-serif;
    font-size: 16px;
    font-weight: 300;
    line-height: 24px;
    color: #7d7d7d;
`;

const SocialBlock = CardTitle.extend`
    justify-content: space-around;
    padding: 0 8px;
`;

const SocialLink = styled.a`
    display: block;
    padding: 0 10px;
    color: #333;

    ${is('fb')`
        padding-left: 14px;
        padding-right: 6px;
    `};
`;

const IconStyled = styled(Icon)`
    display: block;
`;

const IconTriangle = styled(Icon).attrs({
    name: 'triangle',
    width: '4.2',
    height: '2.8',
})`
    margin: 0 -8.4px 0 3px;
`;

export default class UserCardAbout extends PureComponent {
    static propTypes = {
        account: PropTypes.object,
        followerCount: PropTypes.number,
        followingCount: PropTypes.number,
    };

    onShowFollowers = () => {
        DialogManager.showDialog({
            component: FollowersDialog,
            props: {
                pageAccountName: this.props.account.get('name'),
                type: 'follower',
            },
        });
    };

    onShowFollowing = () => {
        DialogManager.showDialog({
            component: FollowersDialog,
            props: {
                pageAccountName: this.props.account.get('name'),
                type: 'following',
            },
        });
    };

    render() {
        const { account, followerCount, followingCount } = this.props;
        const { location, gender, about, website, social } = normalizeProfile(account.toJS());

        // set account join date
        let accountJoin = account.get('created');
        const transferFromSteemToGolosDate = '2016-09-29T12:00:00';
        if (new Date(accountJoin) < new Date(transferFromSteemToGolosDate)) {
            accountJoin = transferFromSteemToGolosDate;
        }

        const websiteLabel = website
            ? website.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')
            : null;

        const reputation = repLog10(account.get('reputation'));

        const localizedGender = {
            male: tt('g.gender.male'),
            female: tt('g.gender.female'),
        };

        return (
            <CollapsingCardStyled title={'Краткая информация'} saveStateKey="info">
                <CardContentCounters>
                    <Row>
                        <ColumnClick onClick={this.onShowFollowers}>
                            <Bold>
                                {followerCount} <IconTriangle />
                            </Bold>
                            <Title>Подписчиков</Title>
                        </ColumnClick>
                        <ColumnClick onClick={this.onShowFollowing}>
                            <Bold>
                                {followingCount} <IconTriangle />
                            </Bold>
                            <Title>Подписок</Title>
                        </ColumnClick>
                    </Row>

                    <Row>
                        <Column>
                            <Bold>{account.get('post_count')}</Bold>
                            <Title>Постов</Title>
                        </Column>
                        <Column>
                            <Bold>{reputation}</Bold>
                            <Title>Рейтинг</Title>
                        </Column>
                    </Row>

                    <Row>
                        {localizedGender[gender] && (
                            <Column>
                                <Bold>{localizedGender[gender]}</Bold>
                                <Title>Пол</Title>
                            </Column>
                        )}
                        <Column>
                            <Title>
                                На Golos с{' '}
                                <FormattedDate value={accountJoin} year="numeric" month="numeric" />
                            </Title>
                        </Column>
                    </Row>
                </CardContentCounters>

                {(website || about || location) && (
                    <CardTitle justify="space-between">
                        О себе
                        {location && <UserCardCity>{location}</UserCardCity>}
                    </CardTitle>
                )}
                {(website || about) && (
                    <CardContent>
                        {website && (
                            <UserCardSite href={makeLeaveLink(website)}>
                                {websiteLabel}
                            </UserCardSite>
                        )}
                        {about && <UserCardBio>{about}</UserCardBio>}
                    </CardContent>
                )}

                {social &&
                    Object.keys(social).length && (
                        <SocialBlock justify="space-between">
                            {social.facebook && (
                                <SocialLink
                                    href={makeSocialLink(social.facebook, 'https://facebook.com/')}
                                    fb={1}
                                    target="_blank"
                                >
                                    <IconStyled name="facebook" width="13" height="24" />
                                </SocialLink>
                            )}
                            {social.vkontakte && (
                                <SocialLink
                                    href={makeSocialLink(social.vkontakte, 'https://vk.com/')}
                                    target="_blank"
                                >
                                    <IconStyled name="vk" width="28" height="18" />
                                </SocialLink>
                            )}
                            {social.instagram && (
                                <SocialLink
                                    href={makeSocialLink(
                                        social.instagram,
                                        'https://instagram.com/'
                                    )}
                                    target="_blank"
                                >
                                    <IconStyled name="instagram" size="23" />
                                </SocialLink>
                            )}
                            {social.twitter && (
                                <SocialLink
                                    href={makeSocialLink(social.twitter, 'https://twitter.com/')}
                                    target="_blank"
                                >
                                    <IconStyled name="twitter" width="26" height="22" />
                                </SocialLink>
                            )}
                        </SocialBlock>
                    )}
            </CollapsingCardStyled>
        );
    }
}
