import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import LinkSelect from 'golos-ui/LinkSelect';

const Root = styled.div`
  display: flex;
  height: 48px;
  padding-right: 6px;
  background: #fff;
`;

const Filler = styled.div`
  flex-grow: 1;
`;

export default class NavigationMobile extends PureComponent {
  static propTypes = {
    compact: PropTypes.bool,
    pathname: PropTypes.string,
    tabLinks: PropTypes.array.isRequired,
    rightItems: PropTypes.object,
  };

  render() {
    const { tabLinks, rightItems, pathname, className } = this.props;

    return (
      <Root className={className}>
        <LinkSelect pathname={pathname} links={tabLinks} />
        <Filler />
        {rightItems}
      </Root>
    );
  }
}
