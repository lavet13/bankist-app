import styled from 'styled-components';

export const Input = styled.input`
  padding: 5px 20px;
  width: 120px;
  text-align: center;
  font-size: 16px;
  font-family: inherit;
  color: inherit;
  border: 1px solid #fff;
  border-radius: 100px;
  transition: all 0.3s;

  &:focus {
    outline: none;
    border: 1px solid #ccc;
  }
`;
