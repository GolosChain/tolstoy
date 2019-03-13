import React, { PureComponent } from 'react';

import HomeContainer from 'src/app/containers/home/HomeContainer';
import HomeContent from 'src/app/containers/home/content';
import HomeSidebar from 'src/app/containers/home/sidebar';

export default class Home extends PureComponent {
    render() {
        return <HomeContainer content={<HomeContent />} sidebar={<HomeSidebar />} />;
    }
}
