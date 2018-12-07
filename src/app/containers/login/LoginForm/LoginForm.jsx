import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import tt from 'counterpart';

import DialogManager from 'app/components/elements/common/DialogManager';
import { translateError } from 'app/utils/ParsersAndFormatters';
import Button from 'golos-ui/Button';
import Icon from 'golos-ui/Icon';
import { Checkbox } from 'golos-ui/Form';
import { logOpenDialogAnalytics } from 'src/app/helpers/gaLogs';

const WIF_LENGTH = 52;
const OWNER_KEY_OPERATIONS = [
    'recover_account',
    'change_recovery_account',
    'decline_voting_rights',
    'set_reset_account',
];

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
    padding: 4px 12px;
    margin-bottom: 20px;
    text-align: center;
    color: #393636;
    font-size: 24px;
    font-weight: 900;
    line-height: 32px;
`;

const Form = styled.form`
    display: flex;
    align-items: flex-start;
    flex-direction: column;
`;

const ErrorBlock = styled.div`
    min-height: 30px;
    padding: 6px 0;
    line-height: 16px;
    font-size: 12px;
    color: #fc5d16;
`;

const LoginBlock = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 30px;
    border-radius: 6px;
    border: solid 1px #e1e1e1;
`;

const LoginLabel = styled.div`
    width: 30px;
    line-height: 26px;
    border-right: solid 1px #e1e1e1;
    font-weight: 500;
    text-align: center;

    &::after {
        content: '@';
        color: #bebebe;
    }
`;

const Input = styled.input`
    padding: 0 12px;
    font-size: 14px;
    color: #393636;
    outline: none;
    box-shadow: none !important;
    -webkit-appearance: none;
`;

const LoginInput = styled(Input)`
    flex: 1;
    border: none;
    border-radius: 0 5px 5px 0;
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
    margin-bottom: 20px;
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
        currentUsername: PropTypes.string,
        username: PropTypes.string,
        authType: PropTypes.oneOf(['owner', 'active', 'memo']),
        isConfirm: PropTypes.bool,
        forceSave: PropTypes.bool,
        operationType: PropTypes.string,
        loginOperation: PropTypes.object,
        strictAuthType: PropTypes.bool,
        loginError: PropTypes.string,
        loginCanceled: PropTypes.func.isRequired,
        onClose: PropTypes.func,
    };

    state = {
        username: this.getUsernameFromProps(),
        password: '',
        consent: true,
        saveCredentials: process.env.BROWSER ? localStorage.getItem('saveLogin') !== 'no' : true,
        submitting: false,
        activeConfirmed: false,
    };

    componentDidMount() {
        this.logEventAnalytics();
    }

    logEventAnalytics() {
        const { isConfirm } = this.props;
        if (!isConfirm) {
            logOpenDialogAnalytics('Sign in dialog');
        }
    }

    getUsernameFromProps() {
        const { isConfirm, currentUsername, username, operationType } = this.props;

        const name = username || currentUsername;

        if (!name) {
            return '';
        }

        let stateUsername = name;

        if (isConfirm && name && !name.includes('/')) {
            let needKeyType = 'active';

            if (operationType && OWNER_KEY_OPERATIONS.includes(operationType)) {
                needKeyType = 'owner';
            }

            stateUsername += `/${needKeyType}`;
        }

        return stateUsername;
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
        const saveCredentials = !this.state.saveCredentials;
        this.setState({ saveCredentials });
        localStorage.setItem('saveLogin', saveCredentials ? 'yes' : 'no');
        this.clearError();
    };

    submit = async () => {
        const { isConfirm, strictAuthType, loginOperation, forceSave } = this.props;
        const { username, password, activeConfirmed } = this.state;

        if (
            !isConfirm &&
            !activeConfirmed &&
            password.startsWith('P') &&
            password.length === WIF_LENGTH
        ) {
            const result = await DialogManager.confirm(tt('loginform_jsx.password_warning'), {
                width: 460,
            });

            if (!result) {
                return;
            }

            this.setState({
                activeConfirmed: true,
            });
        }

        let name = username.trim().toLowerCase();

        if (!strictAuthType) {
            // 'nickname/active' => 'nickname'
            name = name.replace(/\/.+$/, '');
        }

        this.props.dispatchLogin({
            username: name,
            password,
            saveLogin: forceSave || this.state.saveCredentials,
            isLogin: !isConfirm,
            loginOperation,
            isConfirm,
        });
    };

    onFormSubmit = e => {
        e.preventDefault();

        const { consent, submitting } = this.state;

        if (submitting || !consent) {
            return;
        }

        this.submit();
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

    onLoginChange = e => {
        this.setState({
            username: e.target.value,
        });

        this.clearError();
    };

    onPasswordChange = e => {
        this.setState({
            password: e.target.value,
        });

        this.clearError();
    };

    render() {
        const { onClose, loginError, isConfirm, forceSave, operationType, className } = this.props;
        const { username, password, consent, saveCredentials, submitting } = this.state;

        let loginErr = null;
        let passwordErr = null;

        const lockUsername = isConfirm && username;

        if (loginError) {
            if (loginError === 'Incorrect Password') {
                passwordErr = tt('g.incorrect_password');
            } else if (loginError === 'active_login_blocked') {
                passwordErr = tt('loginform_jsx.active_key_error');
            } else {
                loginErr = translateError(loginError);
            }
        }

        let needKeyType = null;

        if (isConfirm) {
            needKeyType = 'active';

            if (operationType && OWNER_KEY_OPERATIONS.includes(operationType)) {
                needKeyType = 'owner';
            }
        }

        return (
            <Wrapper className={className}>
                {onClose ? (
                    <CloseButton onClick={this.onCrossClick}>
                        <Icon name="cross_thin" width={16} height={16} />
                    </CloseButton>
                ) : null}
                <Form onSubmit={this.onFormSubmit}>
                    <Title>{isConfirm ? tt('loginform_jsx.authorize_for') : tt('g.login')}</Title>
                    <LoginBlock>
                        <LoginLabel />
                        <LoginInput
                            placeholder={tt('loginform_jsx.enter_your_username')}
                            autoCapitalize="no"
                            autoCorrect="off"
                            spellCheck="false"
                            readOnly={submitting || lockUsername}
                            required
                            value={username}
                            onChange={this.onLoginChange}
                        />
                    </LoginBlock>
                    <ErrorBlock>{loginErr}</ErrorBlock>
                    <PasswordInput
                        type="password"
                        placeholder={
                            isConfirm
                                ? needKeyType === 'owner'
                                    ? tt('loginform_jsx.password_or_owner')
                                    : tt('loginform_jsx.password_or_active')
                                : tt('loginform_jsx.password_or_posting')
                        }
                        required
                        disabled={submitting}
                        value={password}
                        onChange={this.onPasswordChange}
                    />
                    <ErrorBlock>{passwordErr}</ErrorBlock>
                    <BlockCheckboxes>
                        {
                            // commented for a while
                            /*<ConsentCheckbox tabIndex="0" onClick={this.changeConsent}>
                            <Checkbox value={consent} />
                            <CheckboxLabel>{tt('loginform_jsx.consent')}</CheckboxLabel>
                        </ConsentCheckbox>*/
                        }
                        {forceSave ? null : (
                            <ConsentCheckbox tabIndex="0" onClick={this.changeSaveCredentials}>
                                <Checkbox value={saveCredentials} />
                                <CheckboxLabel>
                                    {isConfirm
                                        ? tt('loginform_jsx.save_password_on_page')
                                        : tt('loginform_jsx.keep_me_logged_in')}
                                </CheckboxLabel>
                            </ConsentCheckbox>
                        )}
                    </BlockCheckboxes>
                    <LoginButton disabled={submitting || !consent} onClick={this.submit}>
                        {isConfirm ? tt('g.authorize') : tt('g.login')}
                    </LoginButton>
                </Form>
            </Wrapper>
        );
    }
}
