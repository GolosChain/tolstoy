import React, { PureComponent } from 'react';
import styled from 'styled-components';

import { Select } from 'golos-ui/Form';
import { LANGUAGES } from 'app/client_config';

const StyledSelect = styled(Select)`
    font-weight: 500;
    border: none;

    &:focus {
        border: none;
    }
`;

const LocaleSelect = ({ locale, onChangeLocale }) => (
    <StyledSelect defaultValue={locale} onChange={e => onChangeLocale(e.target.value)}>
        {Object.keys(LANGUAGES).map(key => (
            <option key={key} value={key}>
                {LANGUAGES[key].shortValue}
            </option>
        ))}
    </StyledSelect>
);

export default LocaleSelect;
