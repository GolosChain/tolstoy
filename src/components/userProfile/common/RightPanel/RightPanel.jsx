import React, { PureComponent } from 'react';
import tt from 'counterpart';

import Card from 'components/golos-ui/Card';
import CollapsingCard from 'components/golos-ui/CollapsingCard';
import AccountPrice from 'components/userProfile/common/AccountPrice';
import RightActions from 'components/userProfile/common/RightActions';
import AccountTokens from 'components/userProfile/common/AccountTokens';

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
