import { ArrowButton } from './button.styles';

export const BUTTON_TYPE_CLASSES = {
  arrow: 'button/arrow',
};

const getButton = buttonType =>
  ({ [BUTTON_TYPE_CLASSES.arrow]: ArrowButton }[buttonType]);

const Button = ({ buttonType, type, children, ...otherProps }) => {
  if (!buttonType) return;

  const CustomButton = getButton(buttonType);
  return (
    <CustomButton type={type || 'button'} {...otherProps}>
      <span>{children}</span>
    </CustomButton>
  );
};

export default Button;
