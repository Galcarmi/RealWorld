import validator from 'validator';

const lengthValidation =
  (minLength: number, maxLength: number) => (value?: string) => {
    return (
      (value?.length ?? 0) >= minLength && (value?.length ?? 0) <= maxLength
    );
  };

const emailValidation = (value?: string) => {
  return value ? validator.isEmail(value) : false;
};

interface ProfileFormValues {
  username: string;
  email: string;
  password: string;
}

const validateProfileForm = (profileFormValues: ProfileFormValues): boolean => {
  const { username, email, password } = profileFormValues;
  const trimmedUsername = username.trim();
  const trimmedEmail = email.trim();
  const trimmedPassword = password.trim();

  const isUsernameValid = trimmedUsername.length > 0;
  const isEmailValid = trimmedEmail.length > 0;
  const isPasswordValid = trimmedPassword.length === 0;

  return isUsernameValid && isEmailValid && isPasswordValid;
};

export { lengthValidation, emailValidation, validateProfileForm };
