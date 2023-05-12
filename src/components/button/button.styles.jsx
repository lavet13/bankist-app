import styled from 'styled-components';
import { SpinnerContainer } from '../spinner/spinner.styles';

export const ArrowBase = styled.button`
  position: relative;
  border: none;
  background: none;
  color: inherit;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.3s;

  &:hover,
  &:focus {
    outline: none;
    color: #000;
  }
`;

export const ArrowButton = styled(ArrowBase)`
  font-size: 18px;
  background: #e2e6e4;
  border-radius: 30px;
  padding: 10px 30px;

  &:hover,
  &:focus {
    background: #f3f1d5;
  }
`;

export const ArrowSort = styled(ArrowBase)`
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;

  flex: 1 0;
`;

export const ArrowSubmit = styled(ArrowBase)`
  padding: 10px 30px;
  border-radius: 7px;
  font-size: 18px;
  background-color: #fff;

  &:focus {
    outline: none;
    background-color: rgba(255, 255, 255, 0.8);
  }
`;

export const GoogleButton = styled(ArrowSubmit)`
  display: inline-block;
  background: #1a73e8;
  font-weight: 500;
  color: #fff;
  width: 190px;
  border-radius: 4px;
  border: thin solid #888;
  white-space: nowrap;
  transition: background-color 0.2s, border 0.2s, box-shadow 0.2s;
  border: 1px solid transparent;
  width: 30%;
  border-radius: 40px;
  align-self: center;

  &:hover {
    color: #fff;
    background: #1765cc;
    border: 1px solid #0277bd;
    box-shadow: var(
      none,
      0 1px 2px 0 rgba(60, 64, 67, 0.3),
      0 1px 3px 1px rgba(60, 64, 67, 0.15)
    );
  }
`;

export const ButtonSpinner = styled(SpinnerContainer)`
  width: 15px;
  height: 15px;
`;
