import { Fragment } from 'react';
import { useAppSelector } from '../../app/store';

import { selectCurrentUserIsLoading } from '../../features/user/user.selector';

import Spinner from '../../components/spinner/spinner.component';
import BrowserImageSrc from '../../assets/browser.png';
import BalanceImageSrc from '../../assets/balance.png';

import {
  BlackButton,
  Title,
  ButtonContainer,
  Header,
  HeroContent,
  Text,
  HeroWrapper,
  Wrapper,
  HomeContainer,
  SubHeader,
  WhiteButton,
  WindowImage,
} from './home.styles';
import { BUTTON_TYPE_CLASSES } from '../../components/button/button.component';

const Home = () => {
  const currentUserIsLoading = useAppSelector(selectCurrentUserIsLoading);

  return (
    <Fragment>
      {currentUserIsLoading ? (
        <Spinner />
      ) : (
        <HomeContainer>
          <HeroWrapper>
            <HeroContent>
              <Header>Получите кредит быстро и безопасно с нами!</Header>
              <SubHeader>
                Заявка — кредит — минуты.
                <br /> Быстро и просто.
              </SubHeader>
              <ButtonContainer>
                <BlackButton buttonType={BUTTON_TYPE_CLASSES.black}>
                  Получить кредит
                </BlackButton>
                <WhiteButton buttonType={BUTTON_TYPE_CLASSES.white}>
                  Дополнительная информация
                </WhiteButton>
              </ButtonContainer>
            </HeroContent>
            <WindowImage src={BrowserImageSrc} />
          </HeroWrapper>
          <Wrapper>
            <WindowImage src={BalanceImageSrc} />
            <HeroContent>
              <Title>Быстрый и простой способ получить кредит!</Title>
              <Text>
                CreditGo - это онлайн-сервис, который предоставляет возможность
                получить кредит быстро и удобно. Он позволяет заполнить заявку
                на кредит в несколько минут и ожидать решения по заявке в
                течение короткого времени.
              </Text>
            </HeroContent>
          </Wrapper>
        </HomeContainer>
      )}
    </Fragment>
  );
};

export default Home;
