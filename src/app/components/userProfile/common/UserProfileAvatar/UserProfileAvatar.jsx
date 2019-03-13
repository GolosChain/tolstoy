import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Icon from 'golos-ui/Icon';
import proxifyImageUrl from 'src/app/utils/ProxifyUrl';

// Image size bigger than display size for better quality.
// Current image proxy very dramatically reduce quality.
const AVATAR_BACKGROUND_SIZE = '220x220';

const Wrapper = styled.div.attrs({
  style: ({ backgroundUrl }) => ({
    backgroundImage: backgroundUrl ? `url("${backgroundUrl}")` : null,
  }),
})`
  display: flex;
  position: relative;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  height: 120px;
  width: 120px;
  border-radius: 50%;
  box-shadow: 0 7px 16px 0 rgba(0, 0, 0, 0.18);

  background-color: #ffffff;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;

  @media (max-width: 576px) {
    width: 80px;
    height: 80px;
  }
`;

const EmptyAvatar = styled(Icon).attrs({
  name: 'user',
})`
  width: 65px;
  height: 70px;
`;

export default class UserProfileAvatar extends PureComponent {
  static propTypes = {
    avatarUrl: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  };

  render() {
    const { children, avatarUrl } = this.props;

    let backgroundUrl = null;

    if (avatarUrl) {
      backgroundUrl = proxifyImageUrl(avatarUrl, AVATAR_BACKGROUND_SIZE);
    }

    return (
      <Wrapper backgroundUrl={backgroundUrl}>
        {!backgroundUrl && <EmptyAvatar />}
        {children}
      </Wrapper>
    );
  }
}
