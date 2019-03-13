import React from 'react';
import styled from 'styled-components';
import is from 'styled-is';

const ButtonWrapper = styled.div`
  position: relative;
  margin-right: -1px;
  flex-basis: 70px;
  flex-grow: 1;

  &::after {
    position: absolute;
    top: 7px;
    right: 0;
    bottom: 7px;
    content: '';
    width: 1px;
    background: #f3f3f3;
  }

  &:last-child {
    margin-right: 0;

    &::after {
      content: none;
    }
  }
`;

const Button = styled.button`
  display: block;
  width: 100%;
  height: 50px;
  padding: 0 14px;
  border-radius: 0;

  font-size: 15px;
  font-weight: 500;
  margin: 0 !important;
  cursor: pointer;
  outline: none;
  white-space: nowrap;

  color: #6d6d6d;

  &:focus {
    background: #ddebff;
  }

  &:hover {
    color: #3a3a3a;
  }

  &:disabled {
    color: #999;
    background: none;
    cursor: not-allowed;
  }

  ${is('primary')`
    color: #2879ff;
    
    &:hover {
      color: #60a0ff;
    }
    
    &:disabled {
      color: #8fc3ff;
    }
  `};

  ${is('warning')`
    color: #ff4641;
    
    &:hover {
      color: #f00;
    }
    
    &:focus {
      background: #ffe3dd;
    }
    
    &:disabled {
      color: #ffe3dd;
      background: none;
    }
  `};
`;

export default function DialogButton(props) {
  return (
    <ButtonWrapper className={props.className}>
      <Button type="button" {...props} className={null} text={null}>
        {props.text}
      </Button>
    </ButtonWrapper>
  );
}
