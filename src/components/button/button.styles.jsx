import styled, { css } from 'styled-components';
import Spinner from '../../assets/loading.png';

const spinnerStyles = css`
  span {
    visibility: hidden;
  }

  @keyframes animate {
    0% {
      transform: translate(-50%, -50%) rotate(0);
    }

    50% {
      transform: translate(-50%, -50%) rotate(180deg);
    }

    100% {
      transform: translate(-50%, -50%) rotate(360deg);
    }
  }

  &:after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: block;
    width: 15px;
    height: 15px;
    background: url(${Spinner}) no-repeat center/cover;
    animation: animate 1s infinite;
  }
`;

export const ArrowBase = styled.button`
  border: none;
  background: none;
  color: inherit;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.3s;

  &:hover,
  &:focus {
    outline: none;
    color: #777;
  }
`;

export const ArrowButton = styled(ArrowBase)`
  position: relative;
  font-size: 22px;
  background: #e2e6e4;
  border-radius: 30px;
  padding: 6px 30px;

  &:hover,
  &:focus {
    background: #f3f1d5;
  }

  ${({ spinner }) => spinner && spinnerStyles}
`;

export const ArrowSort = styled(ArrowBase)`
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;

  flex: 1 0;
`;

export const ArrowSubmit = styled(ArrowBase)`
  border-radius: 7px;
  font-size: 18px;
  background-color: #fff;

  &:focus {
    outline: none;
    background-color: rgba(255, 255, 255, 0.8);
  }
`;
