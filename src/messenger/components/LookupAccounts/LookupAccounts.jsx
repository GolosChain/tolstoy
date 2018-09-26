import React, { Component } from 'react';
import styled from 'styled-components';

import tt from 'counterpart';
import Icon from 'golos-ui/Icon';

const LookupAccountsWrapper = styled.div`
    display: flex;
    position: relative;

    padding: 10px 20px 10px 10px;
`;

const SearchInpit = styled.input`
    width: 100%;
    height: 30px;
    padding: 5px 35px 5px 20px;

    font-size: 14px;
    border-radius: 100px;
    
    ::placeholder {
        color: #B7B7BA;
    }
`;

const IconStyled = styled.div`
    display: flex;

    position: absolute;
    top: 17px;
    right: 35px;
`;

SearchInpit.defaultProps = {
    type: 'text',
    placeholder: `${tt('messenger.placeholder.search')}`
}

export default class LookupAccounts extends Component {
    render() {
        return (
            <LookupAccountsWrapper>
                <SearchInpit />
                <IconStyled>
                    <Icon name="search" width="16" height="16" />
                </IconStyled>
            </LookupAccountsWrapper>
        );
    }
}
