import React from 'react';
import styled, { css } from 'styled-components';
import is from 'styled-is';

import Flex from 'golos-ui/Flex';

const formControlStyles = css`
    position: relative;
    width: 100%;
    height: auto;
    min-height: 34px;

    font-family: ${({ theme }) => theme.fontFamily};
    font-size: 14px;
    line-height: 1;
    color: #363636;

    border: 1px solid #e1e1e1;
    border-radius: 6px;
    box-shadow: none;

    padding: 9px 33px 9px 14px;
    outline: 0;
    -webkit-appearance: inherit;

    &:focus {
        box-shadow: 0 0 3px #e1e1e1;
        transition: box-shadow 0.1s ease-in-out;
        border: 1px solid #e1e1e1;
    }
`;

export const labelStyles = css`
    position: relative;
    display: flex;
    align-items: center;

    font-family: ${({ theme }) => theme.fontFamily};
    font-size: 14px;
    color: #959595;
    line-height: 1;

    text-transform: none;
    cursor: pointer;

    ${is('dark')`
        color: #393636;
    `};

    ${is('bold')`
        font-weight: bold;
    `};
`;

export const Label = styled.label`
    margin-bottom: 18px;
    ${labelStyles};
`;

export const LabelRow = styled.label`
    justify-content: center;
    margin-right: 20px;
    margin-bottom: 0;
    ${labelStyles};
`;

export const Input = styled.input`
    ${formControlStyles};
`;

export const Select = styled.select`
    ${formControlStyles};
`;

export const Textarea = styled.textarea`
    ${formControlStyles};
    line-height: 17px;
`;

export const FormError = ({ meta: { touched, error, submitError }, className }) =>
    touched && (error || submitError) ? (
        <span className={className}>{error || submitError}</span>
    ) : null;

export const FormGroup = styled(Flex)`
    :not(:last-child) {
        margin-bottom: 20px;
    }
`;
FormGroup.defaultProps = {
    column: true,
};

export const FormGroupRow = styled(Flex)`
    :not(:last-child) {
        margin-bottom: 20px;
    }

    ${Input} {
        flex: 1;
    }
`;

FormGroupRow.defaultProps = {
    align: 'center',
};

export const FormFooter = styled.div`
    display: flex;
    height: 50px;

    border-radius: 0 0 8px 8px;
    box-shadow: 0 0 12px 0 rgba(0, 0, 0, 0.1);
    background-color: #ffffff;

    margin-top: 10px;
    overflow: hidden;
    z-index: 1;

    @media (max-width: 576px) {
        border-radius: 0;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.15);

        .Dialog & {
            border-radius: 8px;
        }
    }
`;

export const FormFooterButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;

    position: relative;
    flex: 1;

    font-size: 12px;
    font-weight: bold;
    line-height: 1;
    letter-spacing: 1.4px;
    text-align: center;
    text-transform: uppercase;
    color: #b7b7ba;

    border-radius: 0;
    cursor: pointer;
    outline: none;

    transition: background 0.3s ease, color 0.3s ease;

    :not(:last-child) {
        margin-right: 1px;

        &::after {
            content: '';
            position: absolute;
            top: 7px;
            bottom: 7px;
            right: -1px;
            width: 1px;
            background: #f3f3f3;
        }
    }

    &:hover,
    &:focus {
        background: #fafafa;
    }

    &:disabled,
    &[disabled] {
        color: rgba(0, 0, 0, 0.3) !important;
        background: rgba(0, 0, 0, 0.03) !important;
        cursor: default;
        cursor: not-allowed;
    }

    ${is('primary')`
        color: #2879ff;

        &:hover,
        &:focus {
          color: #2879ff;
          background: #ddebff;
        }
    `};

    ${is('warning')`
        color: #ff4641;

        &:hover,
        &:focus {
            color: #ff4641;
            background: #ffe3dd;
        }
    `};

    ${is('cancel')`
        color: #b7b7ba;

        &:hover,
        &:focus {
            color: #3a3a3a;
            background: transparent;
        }
    `};
`;
