import React from 'react';
import { NumericFormat } from 'react-number-format';

const DECIMAL_LIMIT = 2;

const NumberInput = React.forwardRef((props, ref) => {
  const { onChange, name, ...others } = props;

  return (
    <NumericFormat
      {...others}
      getInputRef={ref}
      onValueChange={({ value }) => {
        onChange({ target: { name, value } });
      }}
      thousandSeparator
      valueIsNumericString
      allowNegative={false}
      decimalScale={DECIMAL_LIMIT}
    />
  );
});

export default NumberInput;