import React, { PureComponent } from 'react';
import tt from 'counterpart';

import Card from 'golos-ui/Card';
import CollapsingCard from 'golos-ui/CollapsingCard';
import AccountPrice from 'src/app/components/userProfile/common/AccountPrice';
import RightActions from 'src/app/components/userProfile/common/RightActions';
import AccountTokens from 'src/app/components/userProfile/common/AccountTokens';

export default class RightPanel extends PureComponent {
  render() {
    const { params } = this.props;

    return (
      <Card>
        <RightActions pageAccountName={params.accountName || null} />
        <CollapsingCard
          title={tt('user_profile.account_tokens.title')}
          noBorder
          withShadow
          saveStateKey="price"
        >
          <AccountPrice accountName={params.accountName} />
          <AccountTokens accountName={params.accountName} />
        </CollapsingCard>
      </Card>
    );
  }
}
