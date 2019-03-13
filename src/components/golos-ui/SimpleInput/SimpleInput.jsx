import styled from 'styled-components';

const SimpleInput = styled.input`
  display: block;
  width: 100%;
  height: 34px;
  padding: 0 11px;
  border: 1px solid #e1e1e1;
  border-radius: 6px;
  outline: none;
  font-size: 14px;
  box-shadow: none;
  transition: border-color 0.25s;

  &:focus {
    border-color: #8a8a8a;
    box-shadow: none;
  }
`;

export default SimpleInput;
