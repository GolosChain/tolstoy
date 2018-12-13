import React from 'react';
import styled from 'styled-components';

import { Select } from 'golos-ui/Form';
import { LANGUAGES } from 'app/client_config';

const StyledSelect = styled(Select)`
    font-weight: 500;
    border: none;
    cursor: pointer;

    &:focus {
        border: none;
    }

    @media (max-width: 576px) {
        padding: 9px 14px;
        background-image: none;
    }

    @media (max-width: 350px) {
        margin-right: 4px;
        padding: 9px 10px;
    }
`;

const LocaleSelect = ({ currentUser, locale, onChangeLocale, setSettingsLocale }) => (
    <StyledSelect
        defaultValue={locale}
        onChange={e => {
            const { value } = e.target;
            if (currentUser) {
                setSettingsLocale(value);
            }
            onChangeLocale(value);
        }}
    >
        {Object.keys(LANGUAGES).map(key => (
            <option key={key} value={key}>
                {LANGUAGES[key].shortValue}
            </option>
        ))}
    </StyledSelect>
);

export default LocaleSelect;
