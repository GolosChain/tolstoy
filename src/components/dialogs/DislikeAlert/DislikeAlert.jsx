import React, { PureComponent } from 'react';
import styled from 'styled-components';
import tt from 'counterpart';

import DialogFrame from 'components/dialogs/DialogFrame';

const DialogFrameStyled = styled(DialogFrame)`
  flex-basis: 328px;
`;

const Container = styled.div`
  padding: 0 36px;
`;

const Description = styled.div`
  margin: 10px 0 20px;
  text-align: center;
  font-size: 14px;
  color: #959595;
`;

const List = styled.ul`
  margin-bottom: 40px;
`;

const Item = styled.li`
  margin: 18px 0;
  line-height: 1.43;
  font-size: 14px;
`;

export default class DislikeAlert extends PureComponent {
  onOkClick = () => {
    this.props.onClose(true);
  };

  onClose = () => {
    this.props.onClose();
  };

  render() {
    return (
      <DialogFrameStyled
        title={tt('dialogs_dislike.title')}
        titleSize={20}
        icon="dislike"
        buttons={[
          {
            text: tt('dialogs_dislike.ok'),
            warning: true,
            onClick: this.onOkClick,
          },
        ]}
        onCloseClick={this.onClose}
      >
        <Container>
          <Description>{tt('dialogs_dislike.header')}</Description>
          <List>
            <Item>{tt('dialogs_dislike.item_1')}</Item>
            <Item>{tt('dialogs_dislike.item_2')}</Item>
            <Item>{tt('dialogs_dislike.item_3')}</Item>
            <Item>{tt('dialogs_dislike.item_4')}</Item>
          </List>
        </Container>
      </DialogFrameStyled>
    );
  }
}
