import styled from 'styled-components';
import { ReactComponent as ProfileIcon } from '../../assets/user.svg';

export const UserProfileIcon = styled(ProfileIcon)``;

export const UserIconContainer = styled.div`
  padding: 20px;
  cursor: pointer;

  &:hover ${UserProfileIcon} {
    fill: #333;
  }

  &:hover {
    background-color: rgba(255, 255, 255, 0.6);
    border-radius: 20px;
  }
`;
