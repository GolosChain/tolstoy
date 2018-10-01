import React, { Component } from 'react';
import { connect } from 'react-redux';

import { utils } from 'golos-js';

import { 
    searchAccounts,
    closeSearchResults
} from '../../redux/actions/search';
import LookupAccounts from '../../components/LookupAccounts';

@connect(
    null,
    {
        searchAccounts,
        closeSearchResults
    }
)

export default class LookupAccountsContainer extends Component {

    handleSearchInput = query => {
        const nameError = utils.validateAccountName(query);

        if (!nameError) {
            this.props.searchAccounts(query);
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
