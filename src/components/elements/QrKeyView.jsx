import React, { PureComponent } from 'react';
import tt from 'counterpart';
import styled from 'styled-components';
import qrImage from 'qr-image';

import Button from 'components/golos-ui/Button';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  flex-basis: 500px;
  align-items: center;
  padding: 24px 18px;
  border-radius: 8px;
  background: #fff;
`;

const Header = styled.h3`
  margin-bottom: 20px;
  font-size: 20px;
  font-weight: 500;
  text-transform: uppercase;
`;

const Footer = styled.div`
  margin-top: 24px;
`;

export default class QrKeyView extends PureComponent {
  onClose = () => {
    this.props.onClose();
  };

  render() {
    const { type, text, isPrivate } = this.props;

    const pngBuffer = qrImage.imageSync(text, { type: 'png', margin: 1 });

    const dataURI = 'data:image/png;base64,' + pngBuffer.toString('base64');

    return (
      <Root>
        <Header>
          {isPrivate
            ? tt('userkeys_jsx.private_something_key', { key: type })
            : tt('userkeys_jsx.public_something_key', { key: type })}
          :
        </Header>
        <img src={dataURI} />
        <Footer>
          <Button onClick={this.onClose}>{tt('g.close')}</Button>
        </Footer>
      </Root>
    );
  }
}
