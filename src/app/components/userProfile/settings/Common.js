import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Map } from 'immutable';

import { Form, Field } from 'react-final-form';
import tt from 'counterpart';

import { CURRENCIES, LANGUAGES } from 'app/client_config';

import SplashLoader from 'golos-ui/SplashLoader';
import { CardContent } from 'golos-ui/Card';
import { DialogFooter, DialogButton } from 'golos-ui/Dialog';
import {
    FormGroup,
    Label,
    LabelRow as StyledLabelRow,
    Select,
    RadioGroup,
    Checkbox,
    FormError,
} from 'golos-ui/Form';

const LabelRow = styled(StyledLabelRow)`
    margin-left: 14px;
`;

const emptyMap = new Map();
export default class Common extends PureComponent {
    static propTypes = {
        options: PropTypes.object,
        isFetching: PropTypes.bool,
        isChanging: PropTypes.bool,
        onSubmitGate: PropTypes.func,
    };

    render() {
        const { options, isChanging, onSubmitGate } = this.props;
        const data = {
            basic: options.getIn(['basic'], emptyMap).toJS(),
        };

        return (
            <Form onSubmit={onSubmitGate} initialValues={data}>
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
                            <Field name="basic.lang">
                                {({ input, meta }) => (
                                    <FormGroup>
                                        <Label>{tt('settings_jsx.choose_language')}</Label>
                                        <Select
                                            {...input}
                                            onChange={e => input.onChange(e.target.value)}
                                        >
                                            {Object.keys(LANGUAGES).map(key => (
                                                <option key={key} value={key}>
                                                    {LANGUAGES[key].value}
                                                </option>
                                            ))}
                                        </Select>
                                    </FormGroup>
                                )}
                            </Field>
                            <Field name="basic.currency">
                                {({ input, meta }) => (
                                    <FormGroup>
                                        <Label>{tt('settings_jsx.choose_currency')}</Label>
                                        <Select
                                            {...input}
                                            onChange={e => input.onChange(e.target.value)}
                                        >
                                            {CURRENCIES.map(key => (
                                                <option key={key} value={key}>
                                                    {key}
                                                </option>
                                            ))}
                                        </Select>
                                    </FormGroup>
                                )}
                            </Field>
                            <Field name="basic.nsfw">
                                {({ input, meta }) => (
                                    <FormGroup>
                                        <Label dark bold>
                                            {tt('settings_jsx.not_safe_for_work_nsfw_content')}
                                        </Label>
                                        <RadioGroup
                                            options={[
                                                {
                                                    id: 'hide',
                                                    title: tt('settings_jsx.always_hide'),
                                                },
                                                {
                                                    id: 'warn',
                                                    title: tt('settings_jsx.always_warn'),
                                                },
                                                {
                                                    id: 'show',
                                                    title: tt('settings_jsx.always_show'),
                                                },
                                            ]}
                                            {...input}
                                            light
                                        />
                                        <FormError meta={meta} />
                                    </FormGroup>
                                )}
                            </Field>
                            {/* <Field name="basic.award">
                                {({ input, meta }) => (
                                    <FormGroup>
                                        <Label dark>Награда по умолчанию за пост</Label>
                                        <Slider {...input} showCaptions />
                                        <FormError meta={meta} />
                                    </FormGroup>
                                )}
                            </Field> */}
                            <Field name="basic.selfVote">
                                {({ input, meta }) => (
                                    <FormGroup align="center" column={false}>
                                        <Checkbox {...input} />
                                        <LabelRow>{tt('settings_jsx.self_vote_default')}</LabelRow>
                                        <FormError meta={meta} />
                                    </FormGroup>
                                )}
                            </Field>
                            <Field name="basic.rounding">
                                {({ input, meta }) => (
                                    <FormGroup>
                                        <Label dark bold>
                                            {tt('settings_jsx.rounding_numbers.info_message')}
                                        </Label>
                                        <RadioGroup
                                            options={[
                                                {
                                                    id: '0',
                                                    title: tt(
                                                        'settings_jsx.rounding_numbers.integer'
                                                    ),
                                                },
                                                {
                                                    id: '1',
                                                    title: tt(
                                                        'settings_jsx.rounding_numbers.one_decimal'
                                                    ),
                                                },
                                                {
                                                    id: '2',
                                                    title: tt(
                                                        'settings_jsx.rounding_numbers.two_decimal'
                                                    ),
                                                },
                                                {
                                                    id: '3',
                                                    title: tt(
                                                        'settings_jsx.rounding_numbers.three_decimal'
                                                    ),
                                                },
                                            ]}
                                            {...input}
                                            light
                                        />
                                        <FormError meta={meta} />
                                    </FormGroup>
                                )}
                            </Field>
                            {/* <pre>{JSON.stringify(values, 0, 2)}</pre> */}

                            {submitError && <div>{submitError}</div>}
                        </CardContent>
                        <DialogFooter>
                            <DialogButton onClick={form.reset} disabled={submitting || pristine}>
                                {tt('settings_jsx.reset')}
                            </DialogButton>
                            <DialogButton
                                type="submit"
                                primary
                                disabled={submitting || pristine || hasValidationErrors}
                            >
                                {tt('settings_jsx.update')}
                            </DialogButton>
                        </DialogFooter>
                    </form>
                )}
            </Form>
        );
    }
}
