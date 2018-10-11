import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import tt from 'counterpart';

import Button from 'golos-ui/Button';
import Icon from 'golos-ui/Icon';
import { Checkbox } from 'golos-ui/Form';

const Wrapper = styled.div`
    margin: 4px 14px;
    font: 14px Roboto;
`;

const CloseButton = styled.div`
    position: absolute;
    top: 10px;
    right: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 24px;
    height: 24px;
    cursor: pointer;
    margin: -6px;

    & svg {
        color: #e1e1e1;
        padding: 0;
    }

    &:hover svg {
        color: #b9b9b9;
    }
`;

const Title = styled.h1`
    text-align: center;
    color: #393636;
    font-size: 24px;
    font-weight: 900;
    line-height: 41px;
`;

const Form = styled.form`
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    & > * {
        width: 100%;
        margin-bottom: 20px;
    }
`;

const LoginBlock = styled.div`
    display: flex;
    justify-content: space-between;
    height: 30px;
    margin-bottom: 30px;
    border-radius: 6px;
    border: solid 1px #e1e1e1;
`;

const LoginLabel = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 30px;
    border-right: solid 1px #e1e1e1;
    color: #bebebe;
    font-weight: 500;
    line-height: 16px;
`;

const LoginInput = styled.input`
    flex: 1;
    padding-left: 14px;
    padding-right: 14px;
    border: none;
    color: #393636;
`;

const PasswordInput = styled.input`
    height: 30px;
    width: 100%;
    padding-left: 14px;
    padding-right: 14px;
    border-radius: 6px;
    border: solid 1px #e1e1e1;
    color: #393636;
`;

const BlockCheckboxes = styled.div`
    margin-top: 20px;

    & > div {
        width: 100%;
        height: 24px;
        color: #393636;
    }
`;

const ConsentCheckbox = styled.div`
    display: flex;
    justify-content: space-between;
`;

const CheckboxLabel = styled.div`
    display: flex;
    align-items: center;
    flex: 1;
    margin-left: 14px;
`;

const LoginButton = styled(Button)`
    width: 170px;
    align-self: center;
    margin-bottom: 0;
`;

export class Login extends Component {
    static propTypes = {
        onCancel: PropTypes.func.isRequired,
    };

    static defaultProps = {};

    state = {
        consent: true,
        saveCredentials: true,
    };

    changeConsent = () => {
        this.setState({
            consent: !this.state.consent,
        });
    };

    changeSaveCredentials = () => {
        this.setState({
            saveCredentials: !this.state.saveCredentials,
        });
    };

    render() {
        const { onCancel, className } = this.props;
        const { consent, saveCredentials } = this.state;
        return (
            <Wrapper className={className}>
                <CloseButton onClick={onCancel}>
                    <Icon name="cross" width={16} height={16} />
                </CloseButton>
                <Form>
                    <Title>{tt('g.login')}</Title>
                    <LoginBlock>
                        <LoginLabel>@</LoginLabel>
                        <LoginInput />
                    </LoginBlock>
                    <PasswordInput type="password" />
                    <BlockCheckboxes>
                        <ConsentCheckbox>
                            <Checkbox value={consent} onChange={this.changeConsent} />
                            <CheckboxLabel>{tt('loginform_jsx.keep_me_logged_in')}</CheckboxLabel>
                        </ConsentCheckbox>
                        <ConsentCheckbox>
                            <Checkbox
                                value={saveCredentials}
                                onChange={this.changeSaveCredentials}
                            />
                            <CheckboxLabel>{tt('loginform_jsx.keep_me_logged_in')}</CheckboxLabel>
                        </ConsentCheckbox>
                    </BlockCheckboxes>
                    <LoginButton>{tt('g.login')}</LoginButton>
                </Form>
            </Wrapper>
        );
    }
}
