import styled from 'styled-components';

export const MovementsContainer = styled.div`
  grid-row: 2 / span 3;
  background-color: #fff;
  border-radius: 10px;
  overflow-y: auto;
  overflow-x: auto;

  /* width */
  &::-webkit-scrollbar {
    width: 10px;
  }

  /* Track */
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  /* Handle */
  &::-webkit-scrollbar-thumb {
    background: #888;
  }

  /* Handle on hover */
  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;
