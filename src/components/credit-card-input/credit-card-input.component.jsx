import React from 'react';
import { PatternFormat } from 'react-number-format';

export const MAX_CREDIT_CARD_SIZE = 16;

const CreditCardInput = React.forwardRef((props, ref) => {
  const { onChange, format, name, ...others } = props;

  return (
    <PatternFormat
      {...others}
      getInputRef={ref}
      format='#### #### #### ####'
      onValueChange={values => {
        onChange({ target: { name, value: values.value } });
      }}
      valueIsNumericString
    />
  );
});

export default CreditCardInput;
