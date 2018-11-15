import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import DialogManager from 'app/components/elements/common/DialogManager';

import CheckLoginOwnerDialog from './CheckLoginOwnerDialog';

class CheckLoginOwner extends PureComponent {
    state = {
        closed: false,
    };

    componentWillReceiveProps(nextProps, nextState) {
        if (nextState.closed) {
            return;
        }

        const { loginOwnerPubKey, previousOwnerAuthority } = nextProps;

        if (loginOwnerPubKey && this.props.loginOwnerPubKey !== loginOwnerPubKey) {
            this.props.lookupPreviousOwnerAuthority();
        }

        if (
            previousOwnerAuthority &&
            this.props.previousOwnerAuthority !== previousOwnerAuthority
        ) {
            const lastValidTime = previousOwnerAuthority.get('last_valid_time');

            if (!lastValidTime) {
                return null;
            }

            // has this been shown already?
            if (localStorage[this.getKey(nextProps)] !== lastValidTime) {
                let lastValidDate;

                if (typeof lastValidTime === 'string' && !lastValidTime.endsWith('Z')) {
                    lastValidDate = lastValidTime + 'Z';
                }

                lastValidDate = new Date(lastValidDate);

                DialogManager.showDialog({
                    component: CheckLoginOwnerDialog,
                    props: {
                        lastValidTime,
                        lastValidDate,
                    },
                    onClose: result => {
                        this.setState({
                            closed: true,
                        });

                        if (result) {
                            if (result.understand) {
                                localStorage[this.getKey()] = lastValidTime;
                            }

                            if (result.recover) {
                                browserHistory.push('/recover_account_step_1');
                            }
                        }
                    },
                });
            }
        }
    }

    getKey = (props = this.props) => {
        const { previousOwnerAuthority } = props;
        const username = previousOwnerAuthority.get('account');
        const key = `${username}_previous_owner_authority_last_valid_time`;

        return key;
    };

    render() {
        return null;
    }
}

export default connect(
    state => {
        const current = state.user.get('current');
        const loginOwnerPubKey = current && current.get('login_owner_pubkey');
        const previousOwnerAuthority = current && current.get('previous_owner_authority');

        return {
            loginOwnerPubKey,
            previousOwnerAuthority,
        };
    },
    {
        lookupPreviousOwnerAuthority: () => ({
            type: 'user/lookupPreviousOwnerAuthority',
            payload: {},
        }),
    }
)(CheckLoginOwner);
