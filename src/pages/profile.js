import React, { PureComponent } from 'react';

import UserProfile from 'src/containers/userProfile/UserProfile';
import BlogContent from 'src/containers/userProfile/blog/BlogContent';
import SidebarRight from 'src/components/userProfile/common/RightPanel';

export default class Home extends PureComponent {
  render() {
    return <UserProfile content={<BlogContent />} sidebar={<SidebarRight />} />;
  }
}
