import React from 'react';
import { PatternFormat } from 'react-number-format';

export const MAX_TEL_SIZE = 10;

const TelephoneInput = React.forwardRef((props, ref) => {
  const { onChange, format, name, ...others } = props;

  return (
    <PatternFormat
      {...others}
      getInputRef={ref}
      format='+7 (###) ###-##-##'
      onValueChange={({ value, formattedValue }) => {
        onChange({ target: { name, formattedValue, value } });
      }}
      valueIsNumericString
    />
  );
});

export default TelephoneInput;
