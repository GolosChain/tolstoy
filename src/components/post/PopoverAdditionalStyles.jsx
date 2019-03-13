import styled from 'styled-components';
import is from 'styled-is';

import Popover from 'components/golos-ui/Popover';

export const PopoverStyled = styled(Popover)`
  z-index: 3;

  @media (max-width: 768px) {
    position: fixed;
    top: 50%;
    left: 50%;
    z-index: 101;
    bottom: auto;
    margin: 0;
    transform: translate(-50%, -50%);

    & > div:first-child {
      display: none;
    }
  }
`;

export const PopoverBackgroundShade = styled.div`
  display: none;

  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
    height: 100%;
    width: 100%;
    background: rgba(0, 0, 0, 0.5);

    ${is('show')`
      display: block;
    `};
  }
`;

export const ClosePopoverButton = styled.div`
  position: absolute;
  display: flex;
  top: 10px;
  right: 10px;
  justify-content: center;
  align-items: center;
  width: 24px;
  height: 24px;
  cursor: pointer;
  color: #e1e1e1;
  transition: color 0.15s;

  &:hover {
    color: #b9b9b9;
  }

  @media (max-width: 768px) {
    display: flex;
  }
`;

export const AvatarBox = styled.div`
  position: absolute;
  top: ${({ popoverOffsetTop }) => popoverOffsetTop}px;
  width: ${({ userPicSize }) => userPicSize}px;
`;
