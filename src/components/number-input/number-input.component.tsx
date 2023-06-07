import React from 'react';
import { NumericFormat, NumericFormatProps } from 'react-number-format';

const DECIMAL_LIMIT = 2;

type Props = {
  name: string;
  onChange: (event: { target: { name: string; value: string } }) => void;
};

const NumberInput = React.forwardRef<NumericFormatProps, Props>(
  (props, ref) => {
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
  }
);

export default NumberInput;
