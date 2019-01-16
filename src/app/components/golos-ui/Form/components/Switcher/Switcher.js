import React from 'react';
import styled from 'styled-components';
import is from 'styled-is';
import { visuallyHidden } from 'src/app/helpers/styles';

const Wrapper = styled.div`
    display: inline-block;
    width: 34px;
    height: 14px;
    flex-shrink: 0;

    border-radius: 7px;
    background-color: #e9e9e9;
    transition: background-color 0.13s;
    cursor: pointer;

    ${is('checked')`
        background-color: #93bbfe;
    `};
`;

const Toggler = styled.div`
    position: relative;
    width: 20px;
    height: 20px;
    top: -3px;
    left: -3px;

    border-radius: 50%;
    background-color: #f6f6f6;
    box-shadow: 0 0 1px 0 rgba(0, 0, 0, 0.12), 0 1px 1px 0 rgba(0, 0, 0, 0.24);

    transition: left 0.13s, background-color 0.13s;

    ${is('checked')`
        left: 17px;
        background-color: #2879FF;
    `};
`;

const HiddenCheckbox = styled.input`
    ${visuallyHidden};
`;

const Switcher = ({ value, onChange }) => (
    <Wrapper checked={value} onClick={() => onChange(!value)}>
        <Toggler checked={value} />
        <HiddenCheckbox type="checkbox" defaultChecked={Boolean(value)} />
    </Wrapper>
);
export default Switcher;
