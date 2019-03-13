import React, { PureComponent } from 'react';

import UserProfile from 'containers/userProfile/UserProfile';
import BlogContent from 'containers/userProfile/blog/BlogContent';
import SidebarRight from 'components/userProfile/common/RightPanel';

export default class Home extends PureComponent {
  render() {
    return <UserProfile content={<BlogContent />} sidebar={<SidebarRight />} />;
  }
}
