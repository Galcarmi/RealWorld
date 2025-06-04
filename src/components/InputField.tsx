import { TextField } from 'react-native-ui-lib';

import { themeColors } from '../theme/colors';
import { lengthValidation } from '../utils/validation';
import { styles } from '../styles/globalStyles';
import { StyleProp } from 'react-native';
import { ViewStyle } from 'react-native';

interface InputFieldProps {
  placeholder: string;
  maxLength?: number;
  minLength?: number;
  validationMessage: string[];
  onChangeText?: (text: string) => void;
  validation?: (value?: string) => boolean;
  containerStyle?: StyleProp<ViewStyle>;
}

const InputField: React.FC<InputFieldProps> = ({
  placeholder,
  maxLength = 30,
  minLength = 6,
  validationMessage,
  onChangeText,
  validation,
  containerStyle,
}) => {
  return (
    <TextField
      containerStyle={containerStyle}
      floatingPlaceholderStyle={{ color: themeColors.placeholderColor }}
      placeholder={placeholder}
      floatingPlaceholder
      onChangeText={onChangeText}
      enableErrors
      validate={[
        'required',
        validation || lengthValidation(minLength, maxLength),
      ]}
      validationMessage={validationMessage}
      maxLength={maxLength}
      preset='underline'
    />
  );
};

export { InputField };
