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

export { lengthValidation, emailValidation };
