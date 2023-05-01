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

export const ArrowButton = styled.button`
  position: relative;
  border: none;
  background: #e2e6e4;
  border-radius: 30px;
  padding: 6px 30px;
  width: 100%;
  font-size: 22px;
  color: inherit;
  cursor: pointer;
  transition: all 0.3s;

  &:hover,
  &:focus {
    outline: none;
    color: #777;
    background: #f3f1d5;
  }

  ${({ spinner }) => spinner && spinnerStyles}
`;
