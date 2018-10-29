import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import tt from 'counterpart';

import { translateError } from 'app/utils/ParsersAndFormatters';
import Button from 'golos-ui/Button';
import Icon from 'golos-ui/Icon';
import { Checkbox } from 'golos-ui/Form';

const Wrapper = styled.div`
    max-width: 90vw;
    min-width: 460px;

    position: relative;
    padding: 20px 30px;
    font: 14px Roboto;
    background-color: #ffffff;
    border-radius: 10px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);

    @media (max-width: 500px) {
        width: 100%;
        margin: 10px;
        min-width: 360px;
    }
`;

const CloseButton = styled.div`
    position: absolute;
    top: 22px;
    right: 22px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 28px;
    height: 28px;
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
    width: 30px;
    line-height: 26px;
    border-right: solid 1px #e1e1e1;
    color: #bebebe;
    font-weight: 500;
    text-align: center;
`;

const Input = styled.input`
    padding-left: 14px;
    padding-right: 14px;
    font-size: 14px;
    color: #393636;
    outline: none;
    box-shadow: none !important;
    -webkit-appearance: none;
`;

const LoginInput = styled(Input)`
    flex: 1;
    border: none;
    border-radius: 0 6px 6px 0;
    background: transparent;
`;

const PasswordInput = styled(Input)`
    height: 30px;
    width: 100%;
    border-radius: 6px;
    border: solid 1px #e1e1e1;
`;

const BlockCheckboxes = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin: 20px 0;
`;

const ConsentCheckbox = styled.label`
    display: flex;
    justify-content: space-between;
    height: 24px;
    padding: 0 4px;
    margin: 0 -4px 4px;
    text-transform: none;
    user-select: none;
    color: #393636;
`;

const CheckboxLabel = styled.div`
    display: flex;
    align-items: center;
    white-space: nowrap;
    flex: 1;
    margin-left: 14px;
`;

const LoginButton = styled(Button)`
    width: 170px;
    align-self: center;
    margin-bottom: 0;
`;

export class LoginForm extends Component {
    static propTypes = {
        loginCanceled: PropTypes.func.isRequired,
        onClose: PropTypes.func,
    };

    state = {
        consent: true,
        saveCredentials: process.env.BROWSER ? localStorage.getItem('saveLogin') !== 'no' : true,
        submitting: false,
    };

    username = React.createRef();
    password = React.createRef();

    componentDidMount() {
        this.props.onRef(this);
    }

    componentWillUnmount() {
        this.props.onRef(null);
    }

    confirmClose = () => {
        this.props.loginCanceled();
        return true;
    };

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
        localStorage.setItem('saveLogin', !this.state.saveCredentials ? 'yes' : 'no');
        this.clearError();
    };

    submit = e => {
        e.preventDefault();
        const data = {
            username: this.username.current.value.trim().toLowerCase(),
            password: this.password.current.value,
            saveLogin: this.state.saveCredentials,
        };
        this.props.dispatchSubmit(data, this.props.loginBroadcastOperation);
    };

    clearError = () => {
        if (this.props.loginError) {
            this.props.clearError();
        }
    };

    onCrossClick = () => {
        this.props.loginCanceled();
        this.props.onClose();
    };

    render() {
        const { onClose, loginError, className } = this.props;
        const { consent, saveCredentials, submitting } = this.state;

        const translatedError = translateError(loginError);

        return (
            <Wrapper className={className}>
                {onClose ? (
                    <CloseButton onClick={this.onCrossClick}>
                        <Icon name="cross_thin" width={16} height={16} />
                    </CloseButton>
                ) : null}
                <Form>
                    <Title>{tt('g.login')}</Title>
                    {loginError ? <ErrorMessage>{translatedError}</ErrorMessage> : null}
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
                        <ConsentCheckbox tabIndex="0" onClick={this.changeConsent}>
                            <Checkbox value={consent} />
                            <CheckboxLabel>{tt('loginform_jsx.consent')}</CheckboxLabel>
                        </ConsentCheckbox>
                        <ConsentCheckbox tabIndex="0" onClick={this.changeSaveCredentials}>
                            <Checkbox value={saveCredentials} />
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
