import styled from 'styled-components';

export const WorkContainer = styled.main`
  position: relative;

  max-width: 1200px;
  margin: 40px auto;

  display: grid;
  grid-template-columns: 4fr 3fr;
  grid-template-rows:
    auto minmax(min-content, max-content) auto minmax(min-content, max-content)
    auto;
  gap: 20px;
`;
