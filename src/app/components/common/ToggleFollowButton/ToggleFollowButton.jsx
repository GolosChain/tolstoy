import React, { Fragment } from 'react';
import tt from 'counterpart';
import Icon from '../../golos-ui/Icon/Icon';
import Button from '../../golos-ui/Button/Button';
import PropTypes from 'prop-types';

const ButtonBlock = Button.extend`
    width: ${({ buttonWidth }) => buttonWidth}px;
`;

export default class ToggleFollowButton extends React.Component {
    static propTypes = {
        isFollow: PropTypes.bool.isRequired,
        buttonWidth: PropTypes.number.isRequired,
        followFunc: PropTypes.func.isRequired,
        unfollowFunc: PropTypes.func.isRequired,
    };

    render() {
        const { isFollow, buttonWidth, followFunc, unfollowFunc } = this.props;

        return (
            <Fragment>
                {isFollow ? (
                    <ButtonBlock light buttonWidth={buttonWidth} onClick={unfollowFunc}>
                        <Icon width="10" height="10" name="cross" />
                        {tt('g.unfollow')}
                    </ButtonBlock>
                ) : (
                    <ButtonBlock buttonWidth={buttonWidth} onClick={followFunc}>
                        <Icon width="11" height="8" name="subscribe" />
                        {tt('g.follow')}
                    </ButtonBlock>
                )}
            </Fragment>
        );
    }
}
