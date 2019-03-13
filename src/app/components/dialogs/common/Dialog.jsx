import styled from 'styled-components';
import { Link } from 'mocks/react-router';

import Icon from 'golos-ui/Icon';
import { breakWordStyles } from 'src/app/helpers/styles';

export const Dialog = styled.div`
  position: relative;
  flex-basis: 800px;
  color: #333;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 0 19px 3px rgba(0, 0, 0, 0.2);

  @media (max-width: 890px) {
    min-width: 300px;
    max-width: 100%;
    width: 100%;
  }
`;

export const IconClose = styled(Icon).attrs({
  name: 'cross',
  size: 30,
})`
  position: absolute;
  right: 8px;
  top: 8px;
  padding: 8px;
  text-align: center;
  color: #e1e1e1;
  cursor: pointer;
  transition: color 0.1s;

  &:hover {
    color: #000;
  }
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  border-radius: 8px 8px 0 0;
  background-color: #ffffff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.15);
`;

export const Title = styled.div`
  text-align: center;
  font-size: 16px;
  font-weight: 600;
  color: #333333;
  text-transform: uppercase;
`;

export const Content = styled.div`
  position: relative;
  padding: 20px;

  @media (max-width: 360px) {
    padding: 20px 10px;
  }
`;

export const UserItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 10px 0;

  &:first-child {
    margin-top: 0;
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

export const UserLink = styled(Link)`
  display: flex;
  min-width: 180px;
  align-items: center;

  @media (max-width: 360px) {
    min-width: unset;
  }
`;

export const Name = styled.p`
  padding: 0;
  margin: 0;
  color: #393636;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.4px;
  line-height: 18px;
  margin-left: 9px;
  ${breakWordStyles};

  @media (max-width: 360px) {
    width: 140px;
    max-width: 140px;
  }
`;

export const LoaderWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 90px;
  opacity: 0;
  animation: fade-in 0.25s forwards;
  animation-delay: 0.25s;
`;
