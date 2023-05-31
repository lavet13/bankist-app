import React from 'react';
import { PatternFormat } from 'react-number-format';

export const MAX_CREDIT_CARD_SIZE = 16;

const CreditCardInput = React.forwardRef((props, ref) => {
  const { onChange, ...others } = props;

  return (
    <PatternFormat
      {...others}
      getInputRef={ref}
      format='#### #### #### ####'
      onValueChange={({ value, formattedValue }) => {
        onChange({ target: { value: { value, formattedValue } } });
      }}
      valueIsNumericString
    />
  );
});

export default CreditCardInput;
