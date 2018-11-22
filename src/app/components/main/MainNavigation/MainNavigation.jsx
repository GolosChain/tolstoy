import React from 'react';
import tt from 'counterpart';

import Navigation from 'src/app/components/common/Navigation';
import LayoutSwitcher from 'src/app/components/common/LayoutSwitcher';

export default function MainNavigation({ myAccountName, search, className }) {
    const tabLinks = [];

    if (myAccountName) {
        tabLinks.push({ value: tt('header_jsx.home'), to: `/@${myAccountName}/feed${search}` });
    }

    tabLinks.push(
        { value: tt('g.new'), to: `/created${search}` },
        { value: tt('main_menu.hot'), to: `/hot${search}` },
        { value: tt('main_menu.trending'), to: `/trending${search}`, index: true },
        { value: tt('g.promoted'), to: `/promoted${search}` }
    );

    return <Navigation tabLinks={tabLinks} rightItems={<LayoutSwitcher />} className={className} />;
}
