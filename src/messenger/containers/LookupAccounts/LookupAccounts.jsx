import React, { Component } from 'react';
import { connect } from 'react-redux';

import { utils } from 'golos-js';

import { searchContacts } from 'src/messenger/redux/actions/search';
import { closeSearchResults } from 'src/messenger/redux/actions/ui';

import LookupAccounts from 'src/messenger/components/LookupAccounts';

@connect(
    null,
    {
        searchContacts,
        closeSearchResults,
    }
)

export default class LookupAccountsContainer extends Component {

    handleSearchInput = query => {
        const nameError = utils.validateAccountName(query);

        if (!nameError) {
            this.props.searchContacts(query);
        }
    }

    closeSearchResults = () => {
        this.props.closeSearchResults();
    }

    render() {
        return (
            <LookupAccounts
                onChange={this.handleSearchInput}
                onClose={this.closeSearchResults}
            />
        );
    }
}
