import styled from 'styled-components';
import Button from '../../components/button/button.component';

export const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  row-gap: 30px;
`;

export const HeroWrapper = styled.div`
  width: 100%;
  display: flex;
  margin-top: 30px;
  column-gap: 15px;
`;

export const Wrapper = styled(HeroWrapper)`
  margin-top: 0;
`;

export const HeroContent = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 25px;
  width: calc(50% - 7.5px);
  margin-top: 20px;
`;

export const Content = styled(HeroContent)`
  margin-top: 0;
`;

export const Header = styled.h1`
  color: #000;
  font-family: inherit;
  font-size: 40px;
  line-height: 1.1;
`;

export const SubHeader = styled.p`
  color: #000;
  font-size: 24px;
  font-family: inherit;
  line-height: 1.3;
`;

export const ButtonContainer = styled.div`
  display: flex;
  column-gap: 40px;
`;

export const BlackButton = styled(Button)`
  width: calc(50% - 20px);
`;

export const WhiteButton = styled(Button)`
  width: calc(50% - 20px);
`;

export const WindowImage = styled.img`
  display: block;
  width: calc(50% - 7.5px);
  object-fit: cover;
`;

export const Title = styled.h3`
  color: #000;
  font-size: 22px;
  font-family: inherit;
  text-align: center;
`;

export const Text = styled.p`
  font-size: 15px;
  font-family: inherit;
  line-height: 1.4;
  width: 96%;
  margin: 0 auto;
`;
