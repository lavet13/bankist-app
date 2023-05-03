import styled from 'styled-components';

export const HomeContainer = styled.main`
  position: relative;

  max-width: 1200px;
  margin: 40px auto;

  display: grid;
  grid-template-columns: 4fr 3fr;
  grid-template-rows: auto repeat(3, 150px) auto;
  gap: 20px;
`;
