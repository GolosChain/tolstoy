import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

import { Form, Field } from 'react-final-form';
import createDecorator from 'final-form-calculate';
import tt from 'counterpart';
import { pick } from 'ramda';

import SplashLoader from 'golos-ui/SplashLoader';
import { CardContent, CardDivider } from 'golos-ui/Card';
import { DialogFooter, DialogButton } from 'golos-ui/Dialog';
import {
    FormGroup,
    FormGroupRow as StyledFormGroupRow,
    Label as StyledLabel,
    LabelRow as StyledLabelRow,
    Switcher,
} from 'golos-ui/Form';
import Icon from 'golos-ui/Icon';

const Label = styled(StyledLabel)`
    margin-bottom: 20px;
`;

const FormGroupRow = styled(StyledFormGroupRow)`
    height: 20px;
`;

const LabelRow = styled(StyledLabelRow)`
    flex: 1;
    justify-content: flex-start;
`;

const LabelIcon = styled(StyledLabelRow)`
    flex-basis: 19px;
    color: #d7d7d7;
    margin-right: 20px;

    ${is('active')`
        color: #2879FF;
    `};
`;

export default class Online extends PureComponent {
    static propTypes = {
        options: PropTypes.object,
        isChanging: PropTypes.bool,
        onSubmitGate: PropTypes.func,
    };

    state = {
        data: {
            notify: this.props.options.get('notify').toJS(),
        },
    };

    componentDidMount() {
        this.setState({
            data: {
                ...this.state.data,
                switchAll: Object.values(this.state.data.notify.show).every(
                    value => value === true
                ),
            },
        });
    }

    handleSubmit = values => {
        const clearedValues = pick(['notify'], values);
        return this.props.onSubmitGate(clearedValues);
    };

    renderSwitchers = () => {
        const switchers = [
            {
                name: 'notify.show.vote',
                label: tt('settings_jsx.notifications.vote'),
                icon: { name: 'like', width: '19', height: '20' },
            },
            {
                name: 'notify.show.flag',
                label: tt('settings_jsx.notifications.flag'),
                icon: { name: 'dislike', size: '18' },
            },
            {
                name: 'notify.show.transfer',
                label: tt('settings_jsx.notifications.transfer'),
                icon: { name: 'coins', width: '20', height: '16' },
            },
            {
                name: 'notify.show.reply',
                label: tt('settings_jsx.notifications.reply'),
                icon: { name: 'comment-reply', width: '19', height: '18' },
            },
            {
                name: 'notify.show.subscribe',
                label: tt('settings_jsx.notifications.subscribe'),
                icon: { name: 'round-check', size: '18' },
            },
            {
                name: 'notify.show.unsubscribe',
                label: tt('settings_jsx.notifications.unsubscribe'),
                icon: { name: 'round-cross', size: '18' },
            },
            {
                name: 'notify.show.mention',
                label: tt('settings_jsx.notifications.mention'),
                icon: { name: 'at', size: '17' },
            },
            {
                name: 'notify.show.repost',
                label: tt('settings_jsx.notifications.repost'),
                icon: { name: 'repost', width: '19', height: '15' },
            },
            {
                name: 'notify.show.reward',
                label: tt('settings_jsx.notifications.award'),
                icon: { name: 'a', width: '14', height: '15' },
            },
            {
                name: 'notify.show.curatorReward',
                label: tt('settings_jsx.notifications.curatorAward'),
                icon: { name: 'k', width: '13', height: '15' },
            },
            {
                name: 'notify.show.message',
                label: tt('settings_jsx.notifications.message'),
                icon: { name: 'comment', width: '19', height: '15' },
            },
            {
                name: 'notify.show.witnessVote',
                label: tt('settings_jsx.notifications.witnessVote'),
                icon: { name: 'like', width: '19', height: '20' },
            },
            {
                name: 'notify.show.witnessCancelVote',
                label: tt('settings_jsx.notifications.witnessCancelVote'),
                icon: { name: 'dislike', size: '18' },
            },
        ];

        return switchers.map(({ name, label, icon }, key) => (
            <Field name={name} key={key}>
                {({ input }) => (
                    <FormGroupRow>
                        <LabelIcon active={input.value}>
                            <Icon {...icon} />
                        </LabelIcon>
                        <LabelRow dark>{label}</LabelRow>
                        <Switcher {...input} />
                    </FormGroupRow>
                )}
            </Field>
        ));
    };

    render() {
        const { isChanging } = this.props;
        const { data } = this.state;

        let isSwitchAllInit = false;

        const calculateSwitchAll = createDecorator(
            {
                field: 'switchAll',
                updates: (value, name, values) => {
                    if (isSwitchAllInit) {
                        const newShow = {};
                        for (let key in values.notify.show) {
                            newShow[key] = value;
                        }

                        values.notify.show = newShow;
                    } else {
                        isSwitchAllInit = true;
                    }

                    return values;
                },
            },
            {
                field: /notify.show.(.*)/,
                updates: (value, name, values) => {
                    values.switchAll = Object.values(values.notify.show).every(
                        value => value === true
                    );
                    return values;
                },
            }
        );

        return (
            <Form
                onSubmit={this.handleSubmit}
                decorators={[calculateSwitchAll]}
                initialValues={data}
            >
                {({ handleSubmit, submitError, form, submitting, pristine, values }) => (
                    <form onSubmit={handleSubmit}>
                        {isChanging && <SplashLoader />}

                        <CardContent column>
                            <Field name="switchAll">
                                {({ input }) => (
                                    <FormGroup>
                                        <Label dark>
                                            {tt('settings_jsx.notifications.allOnlineLabel')}
                                        </Label>
                                        <FormGroupRow>
                                            <LabelIcon active={input.value}>
                                                <Icon name="bell" width="19" height="20" />
                                            </LabelIcon>
                                            <LabelRow dark>
                                                {tt('settings_jsx.notifications.allOnline')}
                                            </LabelRow>
                                            <Switcher {...input} />
                                        </FormGroupRow>
                                    </FormGroup>
                                )}
                            </Field>
                        </CardContent>
                        <CardDivider />
                        <CardContent column>
                            {this.renderSwitchers()}
                            {/* <pre>{JSON.stringify(values, 0, 2)}</pre> */}

                            {submitError && <div>{submitError}</div>}
                        </CardContent>
                        <DialogFooter>
                            <DialogButton onClick={form.reset} disabled={submitting || pristine}>
                                {tt('settings_jsx.reset')}
                            </DialogButton>
                            <DialogButton type="submit" primary disabled={submitting}>
                                {tt('settings_jsx.update')}
                            </DialogButton>
                        </DialogFooter>
                    </form>
                )}
            </Form>
        );
    }
}
