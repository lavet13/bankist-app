import styled from 'styled-components';

export const WorkContainer = styled.main`
  position: relative;

  max-width: 1200px;
  margin: 40px auto;

  display: grid;
  grid-template-columns: 4fr 3fr;
  grid-template-rows: auto 250px 550px 200px auto;
  gap: 20px;
`;
