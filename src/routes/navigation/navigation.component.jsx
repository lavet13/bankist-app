import { Outlet } from 'react-router-dom';

import LogoSrc from '../../assets/logo.png';
import {
  LogoIcon,
  NavigationContainer,
  NavigationWrapper,
  Title,
} from './navigation.styles';

const Navigation = () => {
  return (
    <NavigationContainer>
      <NavigationWrapper>
        <Title>Bankist app</Title>
        <LogoIcon src={LogoSrc} />
      </NavigationWrapper>
      <Outlet />
    </NavigationContainer>
  );
};

export default Navigation;
