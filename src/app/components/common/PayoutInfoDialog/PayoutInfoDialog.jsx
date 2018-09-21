import React, { PureComponent } from 'react';
import styled from 'styled-components';
import Icon from 'golos-ui/Icon';
import PayoutInfo from '../PayoutInfo';

const Root = styled.div`
    position: relative;
`;

const CloseIcon = styled(Icon)`
    position: absolute;
    top: 0;
    right: 0;
    width: 50px;
    height: 50px;
    padding: 18px;
    color: #e1e1e1;
`;

export default class PayoutInfoDialog extends PureComponent {
    render() {
        return (
            <Root>
                <CloseIcon name="cross" onClick={this.props.onClose} />
                <PayoutInfo {...this.props} />
            </Root>
        );
    }
}
