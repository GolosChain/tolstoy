import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import tt from 'counterpart';

import Button from 'golos-ui/Button';
import Icon from 'golos-ui/Icon';
import { Checkbox } from 'golos-ui/Form';

const Wrapper = styled.div`
    max-width: 90%;
    min-width: 460px;

    position: relative;
    padding: 20px 30px;
    font: 14px Roboto;
    background-color: #ffffff;
    border-radius: 10px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);

    @media (max-width: 500px) {
        width: calc(100% - 20px);
        margin: 10px;
        min-width: 360px;
    }
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
    color: #e1e1e1;

    &:hover {
        color: #b9b9b9;
    }
`;

const Title = styled.h1`
    width: 100%;
    margin-bottom: 20px;
    text-align: center;
    color: #393636;
    font-size: 24px;
    font-weight: 900;
    line-height: 41px;
`;

const ErrorMessage = styled.div`
    margin: -24px auto 10px;
    color: #ff0000;
    font-size: 12px;
    text-align: center;
`;

const Form = styled.form`
    display: flex;
    align-items: flex-start;
    flex-direction: column;
`;

const LoginBlock = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;
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
    margin: 20px 0;
`;

const ConsentCheckbox = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 24px;
    color: #393636;
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
        afterLoginRedirectToWelcome: PropTypes.bool,
    };

    static defaultProps = {
        afterLoginRedirectToWelcome: false,
    };

    state = {
        consent: true,
        saveCredentials: true,
        submitting: false,
    };

    username = React.createRef();
    password = React.createRef();

    changeConsent = () => {
        this.setState({
            consent: !this.state.consent,
        });
        this.clearError();
    };

    changeSaveCredentials = () => {
        this.setState({
            saveCredentials: !this.state.saveCredentials,
        });
        this.clearError();
    };

    submit = e => {
        e.preventDefault();
        const data = {
            username: this.username.current.value.trim().toLowerCase(),
            password: this.password.current.value,
            saveLogin: this.state.saveCredentials,
        };
        this.props.dispatchSubmit(
            data,
            this.props.loginBroadcastOperation,
            this.props.afterLoginRedirectToWelcome
        );
    };

    clearError = () => {
        if (this.props.loginError) {
            this.props.clearError();
        }
    };

    render() {
        const { onCancel, loginError, className } = this.props;
        const { consent, saveCredentials, submitting } = this.state;
        return (
            <Wrapper className={className}>
                <CloseButton onClick={onCancel}>
                    <Icon name="cross" width={16} height={16} />
                </CloseButton>
                <Form>
                    <Title>{tt('g.login')}</Title>
                    {loginError ? <ErrorMessage>{loginError}</ErrorMessage> : null}
                    <LoginBlock>
                        <LoginLabel>@</LoginLabel>
                        <LoginInput
                            innerRef={this.username}
                            placeholder={tt('loginform_jsx.enter_your_username')}
                            disabled={submitting}
                            required
                            onChange={this.clearError}
                        />
                    </LoginBlock>
                    <PasswordInput
                        type="password"
                        innerRef={this.password}
                        placeholder={tt('loginform_jsx.password_or_wif')}
                        disabled={submitting}
                        required
                        onChange={this.clearError}
                    />
                    <BlockCheckboxes>
                        <ConsentCheckbox>
                            <Checkbox value={consent} onChange={this.changeConsent} />
                            <CheckboxLabel>{tt('loginform_jsx.consent')}</CheckboxLabel>
                        </ConsentCheckbox>
                        <ConsentCheckbox>
                            <Checkbox
                                value={saveCredentials}
                                onChange={this.changeSaveCredentials}
                            />
                            <CheckboxLabel>{tt('loginform_jsx.keep_me_logged_in')}</CheckboxLabel>
                        </ConsentCheckbox>
                    </BlockCheckboxes>
                    <LoginButton disabled={submitting || !consent} onClick={this.submit}>
                        {tt('g.login')}
                    </LoginButton>
                </Form>
            </Wrapper>
        );
    }
}
