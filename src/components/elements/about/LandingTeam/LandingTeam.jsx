import React, { PureComponent } from 'react';
import tt from 'counterpart';
import styled from 'styled-components';

import golosTeam from './golos-team.json';
import coreTeam from './core-team.json';
import Icon from 'components/golos-ui/Icon';

const CONTACTS_ORDER = ['golos', 'email', 'github', 'linkedin', 'facebook', 'dribbble'];
const SOCIAL_ICON_SIZE = 32;

const SocialNetworksWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
`;

const SocialNetworkWrapper = styled.span`
  padding: 5px 10px;
`;

const SocialNetworkLink = styled.a`
  display: flex;
  color: #000000;

  &:hover {
    color: #000000;
  }
`;

const Role = styled.p`
  margin-bottom: 0.5rem;
`;

export default class LandingTeam extends PureComponent {
  render() {
    return (
      <section className="Team">
        <div className="row text-center">
          <div className="small-12 columns">
            <h2 className="Team__header" id="team">
              {tt('about_page.team')}
            </h2>
          </div>
        </div>
        {this.renderSection('GOLOS.io', golosTeam, 'golos.io')}
        {this.renderSection('Golos Core', coreTeam, 'core')}
      </section>
    );
  }

  renderSection(title, team, type) {
    return (
      <React.Fragment>
        <div className="row">
          <div className="small-12">
            <h3 className="Team__title">{title}</h3>
          </div>
        </div>
        <div className="row align-middle collapse">
          {type === 'golos.io' ? (
            <div className="Team__info columns small-12 medium-6">
              {tt('about_page.team_golosio.info')}
              <br />
              <a href="/@golosio">{tt('about_page.team_golosio.read_blog')}</a>
              &nbsp;-&nbsp;
              <a href="/@golosio" title={tt('about_page.team_golosio.tip')}>
                @golosio
              </a>
              .
            </div>
          ) : (
            <div className="Team__info columns small-12 medium-6">
              {tt('about_page.team_goloscore.info')}
              <br />
              <a href="/@goloscore">{tt('about_page.team_goloscore.read_blog')}</a>
              &nbsp;-&nbsp;
              <a href="/@goloscore" title={tt('about_page.team_goloscore.tip')}>
                @goloscore
              </a>
              .
            </div>
          )}
        </div>
        <div className="row Team__members text-center">
          {team.map(member => renderMember(member))}
        </div>
      </React.Fragment>
    );
  }
}

function renderMember({ name, role, avatar, avatarUrl, contacts }) {
  const contactsElements = [];

  let avatarElement;

  if (avatarUrl) {
    avatarElement = (
      <div className="Team__member-avatar-wrapper">
        <img className="Team__member-external-avatar" src={avatarUrl} />
      </div>
    );
  } else {
    avatarElement = (
      <img
        className="Team__member-avatar"
        src={`images/team/${avatar}${
          process.env.BROWSER && window.devicePixelRatio > 1 ? '@2x' : ''
        }.jpg`}
      />
    );
  }

  for (let contact of CONTACTS_ORDER) {
    if (contacts[contact]) {
      contactsElements.push(
        <SocialNetworkWrapper key={contact}>
          {renderContact(contact, contacts[contact])}
        </SocialNetworkWrapper>
      );
    }
  }

  return (
    <div
      key={name}
      className="wow fadeIn small-12 medium-4 large-3 columns small-centered Team__member"
      data-wow-delay="1s"
    >
      {avatarElement}
      <div className="Team__member-name">{name}</div>
      <Role>{role}</Role>
      <SocialNetworksWrapper>{contactsElements}</SocialNetworksWrapper>
    </div>
  );
}

function renderContact(type, data) {
  switch (type) {
    case 'golos':
      return (
        <SocialNetworkLink href={`/@${data}`}>
          <Icon name="golos-red-blue" size={SOCIAL_ICON_SIZE} />
        </SocialNetworkLink>
      );
    case 'email':
      return (
        <SocialNetworkLink href={`mailto:${data}`} title={`mail to ${data}`}>
          <Icon name="envelope" size={SOCIAL_ICON_SIZE} />
        </SocialNetworkLink>
      );
    case 'github':
      return (
        <SocialNetworkLink href={`https://github.com/${data}`} target="_blank">
          <Icon name="github-black-circle" size={SOCIAL_ICON_SIZE} />
        </SocialNetworkLink>
      );
    case 'linkedin':
      return (
        <SocialNetworkLink href={`https://www.linkedin.com/in/${data}/`} target="_blank">
          <Icon name="linkedin-circle" size={SOCIAL_ICON_SIZE} />
        </SocialNetworkLink>
      );
    case 'facebook':
      return (
        <SocialNetworkLink href={`https://facebook.com/${data}`} target="_blank">
          <Icon name="facebook-circle" size={SOCIAL_ICON_SIZE} />
        </SocialNetworkLink>
      );
    case 'dribbble':
      return (
        <SocialNetworkLink href={`https://dribbble.com/${data}`} target="_blank">
          <Icon name="dribbble-circle" size={SOCIAL_ICON_SIZE} />
        </SocialNetworkLink>
      );
  }
}
