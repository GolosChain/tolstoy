import React, { PureComponent } from 'react';

import HomeContainer from 'src/containers/home/HomeContainer';
import HomeContent from 'src/containers/home/content';
import HomeSidebar from 'src/containers/home/sidebar';

export default class Home extends PureComponent {
  render() {
    return <HomeContainer content={<HomeContent />} sidebar={<HomeSidebar />} />;
  }
}
