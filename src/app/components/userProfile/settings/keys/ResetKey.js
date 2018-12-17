import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';
import tt from 'counterpart';
import { Form, Field } from 'react-final-form';
import { PublicKey, key_utils } from 'golos-js/lib/auth/ecc';

import SplashLoader from 'golos-ui/SplashLoader';
import { CardContent } from 'golos-ui/Card';
import { Input, CheckboxInput, FormError, FormFooter, FormFooterButton } from 'golos-ui/Form';

const FormErrorStyled = styled(FormError)`
    font-size: 13px;
    color: #f00;
`;

const RulesBlock = styled.div`
    padding: 13px 18px;
    margin-bottom: 28px;
    border: 1px solid #2879ff;
    border-radius: 6px;
`;

const Ol = styled.ol`
    list-style: none;
    counter-reset: li;
    margin: 0 0 0 15px;
`;

const Li = styled.li`
    counter-increment: li;
    font-size: 15px;

    &::before {
        content: counter(li);
        display: inline-block;
        width: 1em;
        margin-left: -1.5em;
        margin-right: 10px;

        font-weight: 900;
        font-size: 14px;
        text-align: right;
        color: #2879ff;
    }
`;

const Hint = styled.div`
    margin-top: 15px;
    font-size: 14px;
    line-height: 20px;
    color: #959595;
`;

const FieldBlock = styled.label`
    margin-bottom: 18px;
    cursor: pointer;
    user-select: none;
    text-transform: none;

    &:last-child {
        margin-bottom: 0;
    }

    ${is('mini')`
        margin-bottom: 10px;
    `};
`;

const LabelText = styled.div`
    font-size: 14px;
    color: #393636;
    user-select: none;
`;

const CheckboxLabel = styled.div`
    margin-left: 10px;
    color: #959595;
`;

export default class ResetKey extends PureComponent {
    static propTypes = {
        account: PropTypes.object.isRequired,
        onSubmitChangePassword: PropTypes.func,
    };

    state = {
        newWif: 'P' + key_utils.get_random_key().toWif(),
    };

    validate = values => {
        return {
            password: !values.password
                ? tt('g.required')
                : PublicKey.fromString(values.password)
                    ? tt('g.you_need_private_password_or_key_not_a_public_key')
                    : undefined,
            confirmPassword: !values.confirmPassword
                ? tt('g.required')
                : values.confirmPassword.trim() !== values.newWif
                    ? tt('g.passwords_do_not_match')
                    : undefined,
            confirmCheck: !values.confirmCheck ? tt('g.required') : undefined,
            confirmSaved: !values.confirmSaved ? tt('g.required') : undefined,
        };
    };

    render() {
        const { account, onSubmitChangePassword } = this.props;
        const { newWif } = this.state;

        const initialData = {
            username: account.get('name'),
            newWif,
        };

        return (
            <Form
                initialValues={initialData}
                validate={this.validate}
                onSubmit={onSubmitChangePassword}
            >
                {({
                    handleSubmit,
                    submitError,
                    form,
                    submitting,
                    pristine,
                    hasValidationErrors,
                }) => (
                    <form onSubmit={handleSubmit}>
                        {submitting && <SplashLoader />}
                        <CardContent column>
                            <RulesBlock>
                                <Ol>
                                    <Li>{tt('password_rules.p1')}</Li>
                                    <Li>
                                        <strong>{tt('password_rules.p2')}</strong>
                                    </Li>
                                    <Li>{tt('password_rules.p3')}</Li>
                                    <Li>{tt('password_rules.p4')}</Li>
                                    <Li>{tt('password_rules.p5')}</Li>
                                    <Li>{tt('password_rules.p6')}</Li>
                                    <Li>{tt('password_rules.p7')}</Li>
                                </Ol>
                            </RulesBlock>
                            <Field name="username">
                                {({ input, meta }) => (
                                    <FieldBlock>
                                        <LabelText>{tt('g.account_name')}</LabelText>
                                        <Input {...input} type="text" autoComplete="off" disabled />
                                        <FormErrorStyled meta={meta} />
                                    </FieldBlock>
                                )}
                            </Field>
                            <Field name="password">
                                {({ input, meta }) => (
                                    <FieldBlock>
                                        <LabelText>{tt('g.current_password')}</LabelText>
                                        <Input
                                            {...input}
                                            type="password"
                                            autoCorrect="off"
                                            autoCapitalize="off"
                                            spellCheck="false"
                                            disabled={submitting}
                                        />
                                        <FormErrorStyled meta={meta} />
                                    </FieldBlock>
                                )}
                            </Field>
                            <Field name="newWif">
                                {({ input, meta }) => (
                                    <FieldBlock>
                                        <LabelText>{tt('g.generated_password')}</LabelText>
                                        <Input
                                            {...input}
                                            type="text"
                                            autoComplete="off"
                                            disabled={submitting}
                                            readOnly
                                        />
                                        <FormErrorStyled meta={meta} />
                                        <Hint>{tt('g.backup_password_by_storing_it')}</Hint>
                                    </FieldBlock>
                                )}
                            </Field>
                            <Field name="confirmPassword">
                                {({ input, meta }) => (
                                    <FieldBlock>
                                        <LabelText>{tt('g.re_enter_generate_password')}</LabelText>
                                        <Input
                                            {...input}
                                            type="text"
                                            autoComplete="off"
                                            autoCorrect="off"
                                            autoCapitalize="off"
                                            spellCheck="false"
                                            disabled={submitting}
                                        />
                                        <FormErrorStyled meta={meta} />
                                    </FieldBlock>
                                )}
                            </Field>
                            <Field name="confirmCheck">
                                {({ input, meta }) => (
                                    <FieldBlock mini>
                                        <CheckboxInput
                                            {...input}
                                            title={
                                                <CheckboxLabel>
                                                    {tt(
                                                        'g.understand_that_APP_NAME_cannot_recover_password',
                                                        { APP_NAME: 'GOLOS.io' }
                                                    )}
                                                </CheckboxLabel>
                                            }
                                        />
                                        <FormErrorStyled meta={meta} />
                                    </FieldBlock>
                                )}
                            </Field>
                            <Field name="confirmSaved">
                                {({ input, meta }) => (
                                    <FieldBlock mini>
                                        <CheckboxInput
                                            {...input}
                                            title={
                                                <CheckboxLabel>
                                                    {tt('g.i_saved_password')}
                                                </CheckboxLabel>
                                            }
                                        />
                                        <FormErrorStyled meta={meta} />
                                    </FieldBlock>
                                )}
                            </Field>
                            {submitError && <div>{submitError}</div>}
                        </CardContent>
                        <FormFooter>
                            <FormFooterButton
                                onClick={form.reset}
                                disabled={submitting || pristine}
                            >
                                {tt('settings_jsx.reset')}
                            </FormFooterButton>
                            <FormFooterButton
                                type="submit"
                                primary
                                disabled={submitting || pristine || hasValidationErrors}
                            >
                                {tt('settings_jsx.update')}
                            </FormFooterButton>
                        </FormFooter>
                    </form>
                )}
            </Form>
        );
    }
}
