import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { TextField } from 'react-native-ui-lib';

import { componentStyles } from '../styles/componentStyles';
import { lengthValidation } from '../utils';

interface InputFieldProps {
  placeholder: string;
  value?: string;
  maxLength?: number;
  minLength?: number;
  validationMessage: string[];
  onChangeText?: (text: string) => void;
  validation?: (value?: string) => boolean;
  containerStyle?: StyleProp<ViewStyle>;
  secureTextEntry?: boolean;
  testID?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  placeholder,
  value,
  maxLength = 30,
  minLength = 6,
  validationMessage,
  onChangeText,
  validation,
  containerStyle,
  secureTextEntry = false,
  testID,
}) => {
  return (
    <TextField
      containerStyle={containerStyle}
      floatingPlaceholderStyle={componentStyles.inputFieldFloatingPlaceholder}
      placeholder={placeholder}
      value={value}
      floatingPlaceholder
      onChangeText={onChangeText}
      enableErrors
      secureTextEntry={secureTextEntry}
      validate={[
        'required',
        validation || lengthValidation(minLength, maxLength),
      ]}
      validationMessage={validationMessage}
      maxLength={maxLength}
      preset='underline'
      testID={testID}
    />
  );
};

export { InputField };
