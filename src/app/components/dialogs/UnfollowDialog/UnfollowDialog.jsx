import React, { Component } from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import tt from 'counterpart';

import DialogFrame from 'app/components/dialogs/DialogFrame';

const BodyWrapper = styled.div`
    text-align: center;
    font-size: 14px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.43;
    letter-spacing: normal;
    text-align: center;
    color: #959595;
`;

const StyledLink = styled(Link)`
    color: #393636;

    &:hover {
        color: #393636;
    }
`;

export default class UnfollowDialog extends Component {
    static propTypes = {
        unfollowingUser: PropTypes.string.isRequired,
    };

    render() {
        const { unfollowingUser } = this.props;

        return (
            <DialogFrame
                className="CommonDialog"
                title={tt('g.unfollow')}
                buttons={this.getButtons()}
                onCloseClick={this.onCloseClick}
                username={unfollowingUser}
            >
                <div className="CommonDialog__body">
                    <BodyWrapper>
                        {tt('g.confirm_unfollow_user')}
                        &nbsp;
                        <StyledLink to={`/@${unfollowingUser}`}>@{unfollowingUser}</StyledLink>?
                    </BodyWrapper>
                </div>
            </DialogFrame>
        );
    }

    getButtons() {
        return [
            {
                text: tt('g.cancel'),
                onClick: this.onCloseClick,
            },
            {
                text: tt('g.cancel_subscription'),
                primary: true,
                onClick: this.onOkClick,
            },
        ];
    }

    onCloseClick = () => {
        this.props.onClose();
    };

    onOkClick = () => {
        this.props.onClose(true);
    };
}
