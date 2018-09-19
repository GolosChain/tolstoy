import React, { Component } from 'react';
import tt from 'counterpart';
import styled from 'styled-components';
import Button from '../../golos-ui/Button';
import PropTypes from 'prop-types';
import { authorSelector, currentUsernameSelector } from '../../../redux/selectors/post/post';
import { connect } from 'react-redux';
import { updateFollow } from '../../../redux/actions/follow';

const Mute = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    min-width: 100%;
    min-height: 100%;
    padding: 0 10px;
    color: #959595;
    font: 12px 'Open Sans', sans-serif;
    font-weight: bold;
    line-height: 23px;
    text-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
    text-transform: uppercase;
    cursor: pointer;

    &:hover {
        color: #7a7a7a;
    }
`;

const Unmute = Button.extend`
    font-size: 12px;
    font-weight: bold;
    line-height: 23px;
`;

class MuteButton extends Component {
    static propTypes = {
        muting: PropTypes.string.isRequired,
        onClick: PropTypes.func,
    };

    static defaultProps = {
        onClick: () => {},
    };

    render() {
        const { isMute, className } = this.props;
        return isMute ? (
            <Unmute light onClick={this._unmute} className={className}>
                {tt('g.unmute')}
            </Unmute>
        ) : (
            <Mute onClick={this._mute} className={className}>
                {tt('g.mute')}
            </Mute>
        );
    }

    _mute = e => {
        this.props.updateFollow(this.props.username, 'ignore');
        this.props.onClick(e);
    };
    _unmute = e => {
        this.props.updateFollow(this.props.username, null);
        this.props.onClick(e);
    };
}

const mapStateToProps = (state, props) => {
    const author = authorSelector(state, props);
    return {
        isMute: author.isMute,
        username: currentUsernameSelector(state),
    };
};

const mapDispatchToProps = (dispatch, { muting }) => {
    return {
        updateFollow: (follower, action) => {
            dispatch(updateFollow(follower, muting, action));
        },
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MuteButton);
