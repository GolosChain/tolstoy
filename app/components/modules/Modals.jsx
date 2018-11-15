import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CloseButton from 'react-foundation-components/lib/global/close-button';
import Reveal from 'react-foundation-components/lib/global/reveal';
import ConfirmTransactionForm from 'app/components/modules/ConfirmTransactionForm';
import user from 'app/redux/User';
import tr from 'app/redux/Transaction';
import MessageBox from 'app/components/modules/Messages';

class Modals extends React.Component {
    static propTypes = {
        show_confirm_modal: PropTypes.bool,
        hideConfirm: PropTypes.func.isRequired,
        show_messages_modal: PropTypes.bool,
        hideMessages: PropTypes.func.isRequired,
    };

    render() {
        const { show_confirm_modal, hideConfirm, show_messages_modal, hideMessages } = this.props;

        return (
            <div>
                {show_confirm_modal && (
                    <Reveal onHide={hideConfirm} show={show_confirm_modal}>
                        <CloseButton onClick={hideConfirm} />
                        <ConfirmTransactionForm onCancel={hideConfirm} />
                    </Reveal>
                )}
                {show_messages_modal && (
                    <Reveal
                        onHide={hideMessages}
                        show={show_messages_modal}
                        size="large"
                        revealClassName="MessagesBox"
                    >
                        <CloseButton onClick={hideMessages} />
                        <MessageBox />
                    </Reveal>
                )}
            </div>
        );
    }
}

export default connect(
    state => {
        return {
            show_confirm_modal: state.transaction.get('show_confirm_modal'),
            show_messages_modal: state.user.get('show_messages_modal'),
        };
    },
    {
        hideConfirm: e => {
            if (e) e.preventDefault();
            return tr.actions.hideConfirm();
        },
        hideMessages: e => {
            if (e) e.preventDefault();
            return user.actions.hideMessages();
        },
    }
)(Modals);
