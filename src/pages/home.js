import React, { PureComponent } from 'react';

import HomeContainer from 'containers/home/HomeContainer';
import HomeContent from 'containers/home/content';
import HomeSidebar from 'containers/home/sidebar';

export default class Home extends PureComponent {
  render() {
    return <HomeContainer content={<HomeContent />} sidebar={<HomeSidebar />} />;
  }
}
