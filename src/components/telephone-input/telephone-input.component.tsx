import React from 'react';
import { PatternFormat, PatternFormatProps } from 'react-number-format';

export const MAX_TEL_SIZE = 10;

type Props = {
  name: string;
  onChange: (event: {
    target: { name: string; value: { value: string; formattedValue: string } };
  }) => void;
};

const TelephoneInput = React.forwardRef<PatternFormatProps, Props>(
  (props, ref) => {
    const { onChange, name, ...others } = props;

    return (
      <PatternFormat
        {...others}
        getInputRef={ref}
        format='+7 (###) ###-##-##'
        onValueChange={({ value, formattedValue }) => {
          onChange({ target: { name, value: { value, formattedValue } } });
        }}
        valueIsNumericString
      />
    );
  }
);

export default TelephoneInput;
