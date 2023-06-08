import styled, { css } from 'styled-components';
import { ReactComponent as ProfileIcon } from '../../assets/user.svg';

export const UserProfileIcon = styled(ProfileIcon)``;

export const userIconStyles = css`
  fill: #333;
`;

export const userProfileIconStyles = css`
  background-color: rgba(100, 100, 100, 0.1);
  border-radius: 20px;
`;

export const UserIconContainer = styled.div`
  padding: 20px;
  cursor: pointer;

  &:hover ${UserProfileIcon} {
    ${userIconStyles}
  }

  &:hover {
    ${userProfileIconStyles}
  }
`;
