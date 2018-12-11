import React from 'react';
import styled from 'styled-components';

import Icon from 'golos-ui/Icon';

const Wrapper = styled.label`
    position: relative;
    display: ${props => (props.inline ? 'inline-flex' : 'flex')};
    align-items: center;
    text-transform: none;
    user-select: none;
    cursor: pointer;
`;

const IconOn = styled(Icon).attrs({ name: 'checkbox-on' })`
    width: 18px;
    height: 18px;
    color: #2879ff;
`;

const IconOff = styled(Icon).attrs({ name: 'checkbox-off' })`
    width: 18px;
    height: 18px;
    color: #d7d7d7;
`;

const Title = styled.div`
    margin-left: 6px;
    font-size: 14px;
`;

const HiddenInput = styled.input`
    position: absolute;
    width: 0;
    height: 0;
    visibility: hidden;
`;

const CheckboxInput = ({ value, title, inline, onChange }) => (
    <Wrapper inline={inline}>
        {value ? <IconOn /> : <IconOff />}
        <HiddenInput
            type="checkbox"
            checked={Boolean(value)}
            onChange={onChange ? () => onChange(!value) : null}
        />
        {title ? <Title>{title}</Title> : null}
    </Wrapper>
);

export default CheckboxInput;
