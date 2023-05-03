import {
  ArrowBase,
  ArrowButton,
  ArrowSort,
  ArrowSubmit,
  GoogleButton,
} from './button.styles';

export const BUTTON_TYPE_CLASSES = {
  base: 'button/base',
  arrow: 'button/arrow',
  arrowSort: 'button/arrowSort',
  arrowSubmit: 'button/arrowSubmit',
  google: 'button/google',
};

const getButton = (buttonType = BUTTON_TYPE_CLASSES.base) =>
  ({
    [BUTTON_TYPE_CLASSES.base]: ArrowBase,
    [BUTTON_TYPE_CLASSES.arrow]: ArrowButton,
    [BUTTON_TYPE_CLASSES.arrowSort]: ArrowSort,
    [BUTTON_TYPE_CLASSES.arrowSubmit]: ArrowSubmit,
    [BUTTON_TYPE_CLASSES.google]: GoogleButton,
  }[buttonType]);

const Button = ({ buttonType, type, children, ...otherProps }) => {
  const CustomButton = getButton(buttonType);
  return (
    <CustomButton type={type || 'button'} {...otherProps}>
      <span>{children}</span>
    </CustomButton>
  );
};

export default Button;
