import React from 'react';
import tt from 'counterpart';

import { TabLink } from 'golos-ui/Tab';
import Navigation from 'src/app/components/common/Navigation';
import LayoutSwitcher from 'src/app/components/common/LayoutSwitcher';

export default function MainNavigation({ myAccountName, className }) {
    const tabLinks = [];

    if (myAccountName) {
        tabLinks.push({ value: tt('header_jsx.home'), to: `/@${myAccountName}/feed` });
    }

    tabLinks.push(
        { value: tt('g.new'), to: '/created' },
        { value: tt('main_menu.hot'), to: '/hot' },
        { value: tt('main_menu.trending'), to: '/trending' },
        { value: tt('g.promoted'), to: '/promoted' }
    );

    return <Navigation tabLinks={tabLinks} rightItems={<LayoutSwitcher />} className={className} />;
}
