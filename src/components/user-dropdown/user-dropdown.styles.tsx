import styled, { css } from 'styled-components';

import {
  UserIconContainer,
  UserProfileIcon,
  userProfileIconStyles,
  userIconStyles,
} from '../user-icon/user-icon.styles';

import { ArrowBase } from '../button/button.styles';

const signOutStyles = css`
  &:hover,
  &:focus {
    color: #f00;
    background-color: rgba(255, 255, 255, 0.2);
  }
`;

export const UserDropdownContainer = styled.div`
  position: absolute;
  top: 72px;
  right: 0;
  display: flex;
  flex-direction: column;
  background: rgba(100, 100, 100, 0.1);
  border-radius: 10px;
  border-top-right-radius: 0;
  backdrop-filter: blur(3px);
  min-width: 300px;
  max-height: 300px;
  width: 100%;
  padding: 10px 0;
  z-index: 10;

  & ~ ${UserIconContainer} {
    ${userProfileIconStyles}
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }

  & ~ ${UserIconContainer}${UserProfileIcon} {
    ${userIconStyles}
  }
`;

type UserDropdownButtonProps = {
  signOut?: boolean;
};

export const UserDropdownButton = styled(ArrowBase)<UserDropdownButtonProps>`
  padding: 10px 0;

  &:hover {
    background-color: rgba(51, 51, 51, 0.12);
  }

  ${({ signOut }) => signOut && signOutStyles}
`;
