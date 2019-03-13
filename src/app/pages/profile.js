import React, { PureComponent } from 'react';

import UserProfile from 'src/app/containers/userProfile/UserProfile';
import BlogContent from 'src/app/containers/userProfile/blog/BlogContent';
import SidebarRight from 'src/app/components/userProfile/common/RightPanel';

export default class Home extends PureComponent {
  render() {
    return <UserProfile content={<BlogContent />} sidebar={<SidebarRight />} />;
  }
}
