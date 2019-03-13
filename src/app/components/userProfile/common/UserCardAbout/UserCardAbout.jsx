import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';
import tt from 'counterpart';

import { FormattedDate } from 'react-intl';

import { repLog10 } from 'src/app/utils/ParsersAndFormatters';
import normalizeProfile from 'src/app/utils/NormalizeProfile';
import { makeSocialLink, sanitizeUrl } from 'src/app/helpers/urls';

import Icon from 'golos-ui/Icon';
import { CardTitle } from 'golos-ui/Card';
import CollapsingCard from 'golos-ui/CollapsingCard';
import UserStatus from '../UserStatus';

import DialogManager from 'src/app/components/elements/common/DialogManager';
import FollowersDialog from 'src/app/components/dialogs/FollowersDialog';

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
  margin: 0 20px 17px 20px;
`;

const CardContentCounters = styled(CardContent)`
  margin: 0;
`;

const Row = styled.div`
  position: relative;
  display: flex;

  &:not(:last-of-type) {
    &:after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: #e1e1e1;
    }
  }
`;

const SizedRow = styled(Row)`
  height: 70px;
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
      top: 0;
      bottom: 0;
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

const LocationIcon = styled(Icon)`
  flex-shrink: 0;
  margin: 0 6px;
`;

const UserCardCityWrapper = styled.div`
  display: flex;
  align-items: center;
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
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  text-decoration: underline;
  text-transform: initial;
`;

const UserCardBio = styled.div`
  font-family: 'Open Sans', sans-serif;
  font-size: 16px;
  font-weight: 300;
  line-height: 24px;
  color: #7d7d7d;
`;

const SocialBlock = styled(CardTitle)`
  justify-content: space-around;
  padding: 0 8px;
`;

const UserInfoTitle = styled(CardTitle)`
  border-bottom: 0;
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
    const { account, followerCount, followingCount, currentAccount } = this.props;
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

    const localizedGender = {
      male: tt('g.gender.male'),
      female: tt('g.gender.female'),
    };

    return (
      <CollapsingCardStyled title={tt('user_profile.account_summary.title')} saveStateKey="info">
        <CardContentCounters>
          <Row>
            <UserStatus currentAccount={currentAccount} reputation={account.get('reputation')} />
          </Row>
          <SizedRow>
            <ColumnClick
              role="button"
              aria-label={tt('aria_label.followers')}
              onClick={this.onShowFollowers}
            >
              <Bold>
                {followerCount} <IconTriangle />
              </Bold>
              <Title>{tt('user_profile.account_summary.followers')}</Title>
            </ColumnClick>
            <ColumnClick
              role="button"
              aria-label={tt('aria_label.following')}
              onClick={this.onShowFollowing}
            >
              <Bold>
                {followingCount} <IconTriangle />
              </Bold>
              <Title>{tt('user_profile.account_summary.following')}</Title>
            </ColumnClick>
          </SizedRow>

          <SizedRow>
            <Column>
              <Bold>{account.get('post_count')}</Bold>
              <Title>
                {tt('user_profile.account_summary.post_count', {
                  count: account.get('post_count'),
                })}
              </Title>
            </Column>
            <Column>
              <Bold>{account.get('comment_count')}</Bold>
              <Title>
                {tt('user_profile.account_summary.comment_count', {
                  count: account.get('comment_count'),
                })}
              </Title>
            </Column>
          </SizedRow>

          <SizedRow>
            {localizedGender[gender] && (
              <Column>
                <Title>
                  {localizedGender[gender]} {tt('user_profile.account_summary.gender')}
                </Title>
              </Column>
            )}
            <Column>
              <Title>
                {tt('user_profile.account_summary.registered')}{' '}
                <FormattedDate value={accountJoin} year="numeric" month="numeric" />
              </Title>
            </Column>
          </SizedRow>
        </CardContentCounters>

        {(website || location) && (
          <UserInfoTitle justify="space-between">
            {website && <UserCardSite href={sanitizeUrl(website)}>{websiteLabel}</UserCardSite>}
            <UserCardCityWrapper>
              <LocationIcon name="location" width="14" height="18" />
              {location && <UserCardCity>{location}</UserCardCity>}
              <IconTriangle />
            </UserCardCityWrapper>
          </UserInfoTitle>
        )}
        {about && <CardContent>{about && <UserCardBio>{about}</UserCardBio>}</CardContent>}

        {social && Boolean(Object.keys(social).length) && (
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
                href={makeSocialLink(social.instagram, 'https://instagram.com/')}
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
