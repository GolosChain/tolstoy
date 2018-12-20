import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router';
import tt from 'counterpart';

import Userpic from '../../common/Userpic';

const MobileAccountBlock = styled(Link)`
    position: relative;
    display: flex;
    align-items: center;
    flex-shrink: 0;
    width: 50px;
    height: 50px;
    margin-left: 4px;
    margin-right: 0;
    cursor: pointer;
    z-index: 1;

    @media (max-width: 500px) {
        margin-left: 0;
    }
`;

const UserpicMobile = styled(Userpic)`
    position: absolute;
    top: 3px;
    left: 3px;
    right: 3px;
    bottom: 3px;
`;

const PowerCircle = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 50%;
    box-shadow: 0 2px 7px 1px rgba(0, 0, 0, 0.1);
`;

export default class AccountInfoMobile extends PureComponent {
    render() {
        const { currentUsername, votingPower } = this.props;

        const angle = 2 * Math.PI - 2 * Math.PI * (votingPower / 100);

        const { x, y } = calcXY(angle);

        return (
            <MobileAccountBlock to={`/@${currentUsername}`} innerRef={this.accountRef}>
                <PowerCircle>
                    <svg viewBox="-1 -1 2 2">
                        <circle cx="0" cy="0" r="1" fill="#2879ff" />
                        <path
                            d={`M ${x * -1} ${y} A 1 1 0 ${angle > Math.PI ? 1 : 0} 1 0 -1 L 0 0`}
                            fill="#cde0ff"
                        />
                    </svg>
                </PowerCircle>
                <UserpicMobile
                    account={currentUsername}
                    size={44}
                    ariaLabel={tt('aria_label.avatar')}
                />
            </MobileAccountBlock>
        );
    }
}

function calcXY(angle) {
    return {
        x: Math.sin(angle),
        y: -Math.cos(angle),
    };
}
