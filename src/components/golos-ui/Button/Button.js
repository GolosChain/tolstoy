import PropTypes from 'prop-types';
//import { Link } from 'app/shared/routes';
import styled from 'styled-components';
import is from 'styled-is';

// TODO: Replace by Link
const Link = styled.a``;

export const BaseButton = styled.button`
  display: inline-flex;
  overflow: hidden;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;

  height: 34px;
  border-radius: 100px;

  margin: 0;
  padding: 0 15px;
  border: 0;
  outline: none;

  color: #fff;
  background: #2879ff;

  font-family: ${({ theme }) => theme.fontFamily};
  font-size: 12px;
  font-weight: bold;
  text-align: center;
  text-overflow: ellipsis;
  text-decoration: none;
  text-transform: uppercase;
  line-height: 1;
  letter-spacing: 1.4px;
  white-space: nowrap;

  cursor: pointer;

  &::-moz-focus-inner {
    padding: 0;
    border: 0;
  }

  &:hover {
    background: #0e69ff;
  }

  &:disabled {
    opacity: 0.8;
    cursor: default;
    background: #2879ff;
  }

  ${is('auto')`
    width: 100%;
  `};

  ${is('light')`
    color: #393636;
    background-color: #fff;
    border: 1px solid #e1e1e1;
    
    &:focus {
      color: #393636;
      background-color: #fff;
      border: 1px solid #e1e1e1;
    }
    
    &:hover {
      color: #393636;
      background-color: #fff;
      border: 1px solid #c0c0c0;
    }
    
    &:disabled {
      background-color: #fff;
    }
  `};
`;

BaseButton.propTypes = {
  type: PropTypes.string,
  auto: PropTypes.bool,
  light: PropTypes.bool,
};

const Button = styled(BaseButton)``;
Button.defaultProps = {
  type: 'button',
};

export const ButtonLink = BaseButton.withComponent(Link);
export default Button;
