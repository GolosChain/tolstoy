import React, { Component } from 'react';

import { utils } from 'golos-js';

import LookupAccounts from 'src/messenger/components/LookupAccounts';

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
