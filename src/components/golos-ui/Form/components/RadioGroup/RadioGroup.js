import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import is from 'styled-is';

import { visuallyHidden } from 'helpers/styles';
import Icon from 'components/golos-ui/Icon';
import { Label as StyledLabel } from 'components/golos-ui/Form';

const Wrapper = styled.div``;

const Item = styled.div`
  display: flex;
  align-items: center;

  &:not(:last-child) {
    margin-bottom: 18px;
  }
`;

const Label = styled(StyledLabel)`
  flex-grow: 1;
  margin: 0;

  ${is('disabled')`
    cursor: default;
  `};
`;

const LabelText = styled.span`
  margin-left: 15px;
  line-height: 1px;
  font-size: 14px;

  ${is('light')`
    color: #959595;
  `};

  ${is('disabled')`
    color: #9c9c9c;
  `};
`;

const Input = styled.input`
  ${visuallyHidden};
`;

const IconStyled = styled(Icon)`
  display: block;
  width: 20px;
  height: 20px;
  color: #d8d8d9;

  ${is('value')`
    color: #2879ff;
  `};

  ${is('disabled')`
    color: #d0d0d0;
  `};
`;

export default class RadioGroup extends PureComponent {
  static propTypes = {
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    options: PropTypes.array.isRequired,
    disabled: PropTypes.bool,
    name: PropTypes.string,
    onChange: PropTypes.func.isRequired,

    light: PropTypes.bool,
  };

  render() {
    const { value, options, disabled, name, light, onChange } = this.props;

    return (
      <Wrapper>
        {options.map(item => {
          const selected = item.id === value;

          return (
            <Item key={item.id}>
              <Label>
                <Input
                  type="radio"
                  name={name}
                  disabled={disabled}
                  checked={selected}
                  onChange={() => onChange(item.id)}
                />
                <IconStyled
                  value={selected}
                  disabled={disabled}
                  name={selected ? 'radio-on' : 'radio-off'}
                />
                <LabelText light={light}>{item.title}</LabelText>
              </Label>
            </Item>
          );
        })}
      </Wrapper>
    );
  }
}
