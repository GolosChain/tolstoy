import { connect } from 'react-redux';

import LookupAccountsContainer from './LookupAccounts';

import { searchContacts } from 'src/messenger/redux/actions/search';
import { closeSearchResults } from 'src/messenger/redux/actions/ui';

export default connect(
  null,
  {
    searchContacts,
    closeSearchResults,
  }
)(LookupAccountsContainer);
