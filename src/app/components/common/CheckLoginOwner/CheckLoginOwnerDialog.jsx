import React from 'react';
import styled from 'styled-components';
import tt from 'counterpart';

import Button from 'golos-ui/Button';
import { CheckboxInput } from 'golos-ui/Form';
import TimeAgoWrapper from 'app/components/elements/TimeAgoWrapper';

const Root = styled.div`
    flex-basis: 500px;
    padding: 18px 24px;
    border-radius: 8px;
    background: #fff;
`;

const Section = styled.div`
    margin-bottom: 16px;
`;

const Footer = styled.div``;

export default class CheckLoginOwnerDialog extends React.Component {
    state = {
        understand: false,
    };

    confirmClose = () => {
        return false;
    };

    onRecoverClick = () => {
        this.props.onClose({
            recover: true,
            understand: this.state.understand,
        });
    };

    onOkClick = () => {
        this.props.onClose({
            understand: this.state.understand,
        });
    };

    onUnderstandChange = checked => {
        this.setState({
            understand: checked,
        });
    };

    render() {
        const { lastValidTime, lastValidDate } = this.props;
        const { understand } = this.state;

        const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;
        const deadline = lastValidDate.getTime() + THIRTY_DAYS;

        // https://steemit.com/steem/@originate/steem-s-new-alert-after-key-updates-is-excellent-but-here-s-a-quick-update-that-would-make-it-even-better
        // If you recently reset your password at(timestamp in strftime, example:  Thu, 21 Jul 2016 02:39:19 PST)
        // this alert was most likely prompted by this action, otherwise your immediate attention is needed
        return (
            <Root>
                <h3>{tt('g.account_updated')}</h3>
                <Section>
                    <span className="warning uppercase">{tt('g.warning')}:</span>{' '}
                    {tt('postfull_jsx.your_password_permissions_were_reduced')}{' '}
                    <TimeAgoWrapper date={lastValidTime} />.{' '}
                    {tt('postfull_jsx.if_you_did_not_make_this_change')}{' '}
                    <a onClick={this.onRecoverClick}>{tt('g.recover_your_account')}</a>.
                </Section>
                <Section>
                    {tt('postfull_jsx.owhership_changed_on')}: {lastValidDate.toLocaleString()}
                </Section>
                <Section>
                    {tt('postfull_jsx.deadline_for_recovery_is')}{' '}
                    <b>
                        <TimeAgoWrapper date={deadline} />
                    </b>
                    .
                </Section>
                <Section>
                    <CheckboxInput
                        value={understand}
                        title={tt('postfull_jsx.i_understand_dont_show_again')}
                        onChange={this.onUnderstandChange}
                    />
                </Section>
                <Footer>
                    <Button onClick={this.onOkClick}>{tt('g.ok')}</Button>
                </Footer>
            </Root>
        );
    }
}
