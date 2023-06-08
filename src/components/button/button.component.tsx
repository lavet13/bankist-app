import { FC, ButtonHTMLAttributes } from 'react';

import {
  ArrowBase,
  ArrowButton,
  ArrowSort,
  ArrowSubmit,
  ButtonSpinner,
  GoogleButton,
  BlackButton,
  WhiteButton,
} from './button.styles';

export enum BUTTON_TYPE_CLASSES {
  base = 'button/base',
  arrow = 'button/arrow',
  arrowSort = 'button/arrowSort',
  arrowSubmit = 'button/arrowSubmit',
  google = 'button/google',
  black = 'button/black',
  white = 'button/white',
}

const getButton = (buttonType = BUTTON_TYPE_CLASSES.base): typeof ArrowBase =>
  ({
    [BUTTON_TYPE_CLASSES.base]: ArrowBase,
    [BUTTON_TYPE_CLASSES.arrow]: ArrowButton,
    [BUTTON_TYPE_CLASSES.arrowSort]: ArrowSort,
    [BUTTON_TYPE_CLASSES.arrowSubmit]: ArrowSubmit,
    [BUTTON_TYPE_CLASSES.google]: GoogleButton,
    [BUTTON_TYPE_CLASSES.black]: BlackButton,
    [BUTTON_TYPE_CLASSES.white]: WhiteButton,
  }[buttonType]);

type ButtonProps = {
  buttonType?: BUTTON_TYPE_CLASSES;
  isLoading?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const Button: FC<ButtonProps> = ({
  buttonType,
  type,
  isLoading,
  children,
  ...otherProps
}) => {
  const CustomButton = getButton(buttonType);
  return (
    <CustomButton disabled={isLoading} type={type || 'button'} {...otherProps}>
      {isLoading ? <ButtonSpinner /> : <span>{children}</span>}
    </CustomButton>
  );
};

export default Button;
