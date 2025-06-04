import { TextField } from 'react-native-ui-lib';

import { themeColors } from '../theme/colors';
import { lengthValidation } from '../utils/validation';

interface InputFieldProps {
  placeholder: string;
  maxLength?: number;
  minLength?: number;
  validationMessage: string[];
  onChangeText?: (text: string) => void;
  validation?: (value?: string) => boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  placeholder,
  maxLength = 30,
  minLength = 6,
  validationMessage,
  onChangeText,
  validation,
}) => {
  return (
    <TextField
      containerStyle={{ width: '80%' }}
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
