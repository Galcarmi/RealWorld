import React, { useMemo } from 'react';
import { StyleProp, ViewStyle, StyleSheet } from 'react-native';
import { TextField, TextFieldProps } from 'react-native-ui-lib';

import { FORM_LIMITS, KEYBOARD_TYPES } from '../constants';
import { FONT_SIZES, COLORS } from '../constants/styles';
import { lengthValidation } from '../utils';

type ValidationFunction = (value?: string) => boolean;

interface InputFieldProps {
  placeholder: string;
  value?: string;
  maxLength?: number;
  minLength?: number;
  validationMessage: string[];
  onChangeText?: (text: string) => void;
  validation?: ValidationFunction;
  containerStyle?: StyleProp<ViewStyle>;
  secureTextEntry?: boolean;
  testID?: string;
  autoCapitalize?: TextFieldProps['autoCapitalize'];
  keyboardType?: TextFieldProps['keyboardType'];
  autoComplete?: TextFieldProps['autoComplete'];
  editable?: boolean;
}

export const InputField: React.FC<InputFieldProps> = ({
  placeholder,
  value,
  maxLength = FORM_LIMITS.INPUT_FIELD_DEFAULT_MAX,
  minLength = FORM_LIMITS.INPUT_FIELD_DEFAULT_MIN,
  validationMessage,
  onChangeText,
  validation,
  containerStyle,
  secureTextEntry = false,
  testID,
  keyboardType = KEYBOARD_TYPES.DEFAULT,
}) => {
  const styles = useMemo(() => createStyles(), []);

  return (
    <TextField
      containerStyle={containerStyle}
      floatingPlaceholderStyle={styles.floatingPlaceholder}
      placeholder={placeholder}
      value={value}
      floatingPlaceholder
      onChangeText={onChangeText}
      enableErrors
      style={styles.inputField}
      secureTextEntry={secureTextEntry}
      validate={[
        'required',
        validation || lengthValidation(minLength, maxLength),
      ]}
      validationMessage={validationMessage}
      maxLength={maxLength}
      preset='underline'
      testID={testID}
      keyboardType={keyboardType}
    />
  );
};

const createStyles = () =>
  StyleSheet.create({
    floatingPlaceholder: {
      color: COLORS.PLACEHOLDER,
    },
    inputField: {
      fontSize: FONT_SIZES.LARGE,
    },
  });
