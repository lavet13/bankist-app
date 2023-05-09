import styled from 'styled-components';

import {
  UserIconContainer,
  UserProfileIcon,
} from '../user-icon/user-icon.styles';

export const UserDropdownContainer = styled.div`
  position: absolute;
  top: 70px;
  right: 0;
  display: flex;
  flex-direction: column;
  row-gap: 10px;
  background: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(3px);
  min-width: 300px;
  max-height: 300px;
  width: 100%;
  padding: 20px 30px;
  z-index: 10;

  &:hover ${UserIconContainer} {
    background-color: rgba(255, 255, 255, 0.6) !important;
    border-radius: 20px !important;
  }

  &:hover ${UserProfileIcon} {
    fill: #333 !important;
  }
`;
