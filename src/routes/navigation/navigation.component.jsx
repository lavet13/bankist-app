import { Link, Outlet } from 'react-router-dom';

import LogoSrc from '../../assets/logo.png';
import {
  LogoIcon,
  NavigationContainer,
  NavigationWrapper,
  Title,
  Anchor,
} from './navigation.styles';

const Navigation = () => {
  return (
    <NavigationContainer>
      <NavigationWrapper>
        <Anchor to='/'>
          <Title>Bankist app</Title>
          <LogoIcon src={LogoSrc} />
        </Anchor>
      </NavigationWrapper>
      <Outlet />
    </NavigationContainer>
  );
};

export default Navigation;
