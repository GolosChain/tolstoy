import React, { Component } from 'react';
import styled from 'styled-components';
import is from 'styled-is';
import PropTypes from 'prop-types';
import tt from 'counterpart';

import Icon from 'golos-ui/Icon';
import Button from 'golos-ui/Button';
import DialogManager from 'app/components/elements/common/DialogManager';

const IconStyled = styled(Icon)`
    margin-right: 6px;
`;

const Wrapper = styled(Button)`
    display: flex;
    justify-content: center;
    align-items: center;
    min-width: 165px;

    font-size: 12px;
    font-weight: bold;
    line-height: 23px;

    span {
        margin-top: 1px;
    }

    ${is('hideInscription')`
        @media (max-width: 500px) {
            width: 34px;
            height: 34px;
            min-width: 0;
            border-radius: 50%;
    
            ${IconStyled} {
                min-width: 12px;
                min-height: 12px;
                margin: 0;
            }
    
                span {
                    display: none;
                }
        }
    `};
`;

export default class Follow extends Component {
    static propTypes = {
        // external
        following: PropTypes.string.isRequired,
        collapseOnMobile: PropTypes.bool,
        onClick: PropTypes.func,

        // connect
        username: PropTypes.string.isRequired,
        isFollow: PropTypes.bool.isRequired,
        showInscriptionAlways: PropTypes.bool,
    };

    static defaultProps = {
        collapseOnMobile: false,
        onClick: () => {},
    };

    render() {
        const { collapseOnMobile, isFollow, showInscriptionAlways, className } = this.props;

        if (isFollow) {
            return (
                <Wrapper
                    light
                    collapseOnMobile={collapseOnMobile}
                    onClick={this.unfollow}
                    hideInscription={!showInscriptionAlways}
                    className={className}
                >
                    <IconStyled width="14" height="10" name="tick" />
                    <span>{tt('g.unfollow')}</span>
                </Wrapper>
            );
        }

        return (
            <Wrapper
                collapseOnMobile={collapseOnMobile}
                onClick={this.follow}
                hideInscription={!showInscriptionAlways}
                className={className}
            >
                <IconStyled width="14" height="14" name="plus" />
                <span>{tt('g.follow')}</span>
            </Wrapper>
        );
    }

    follow = e => {
        this.props.updateFollow(this.props.username, 'blog');
        this.props.onClick(e);
    };

    unfollow = async e => {
        const { username, following, updateFollow, onClick } = this.props;
        if (await DialogManager.confirmUnfollow(following)) {
            updateFollow(username, following, null);
            onClick(e);
        }
    };
}
