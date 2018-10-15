import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import tt from 'counterpart';
import Icon from 'golos-ui/Icon';

import {
    MIN_ACCOUNT_NAME_LENGTH,
    MAX_ACCOUNT_NAME_LENGTH,
} from 'src/messenger/utils/constants';

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
    type: 'text'
}

export default class LookupAccounts extends Component {

    static propTypes = {
        onChange: PropTypes.func.isRequired,
        onClose: PropTypes.func.isRequired
    }

    state = {
        inputValue: '',
        hasValue: false
    }

    handleChange = e => {
        let { hasValue } = this.state;
        const value = e.target.value.trim();
        
        if (value.length >= MIN_ACCOUNT_NAME_LENGTH) {
            hasValue = true;
            this.props.onChange(value);
        } else {
            hasValue = false;
            this.props.onClose();
        }

        this.setState({
            inputValue: value,
            hasValue
        });
    }

    onCloseClick = () => {
        this.setState({
            inputValue: '',
            hasValue: false
        });

        this.props.onClose();
    }

    render() {
        const {
            inputValue,
            hasValue
        } = this.state;

        return (
            <LookupAccountsWrapper>
                <SearchInpit
                    placeholder={tt('messenger.placeholder.search')}
                    onChange={this.handleChange}
                    maxLength={MAX_ACCOUNT_NAME_LENGTH}
                    value={inputValue}
                />
                <IconStyled>
                    {hasValue
                        ? <Icon name="cross" width="16" height="16"
                            onClick={this.onCloseClick}
                          />
                        : <Icon name="search" width="16" height="16" />
                    }
                </IconStyled>
            </LookupAccountsWrapper>
        );
    }
}
