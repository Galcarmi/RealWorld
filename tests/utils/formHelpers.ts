import { fireEvent } from '@testing-library/react-native';

import { TEST_IDS } from '../../src/constants/testIds';

export interface FormData {
  [key: string]: any;
}

export const fillLoginForm = (
  getByTestId: any,
  overrides: Partial<FormData> = {}
) => {
  const defaultData = {
    email: 'test@example.com',
    password: 'password123456',
    ...overrides,
  };

  fireEvent.changeText(
    getByTestId(TEST_IDS.AUTH_EMAIL_INPUT),
    defaultData.email
  );
  fireEvent.changeText(
    getByTestId(TEST_IDS.AUTH_PASSWORD_INPUT),
    defaultData.password
  );

  return defaultData;
};

export const fillSignUpForm = (
  getByTestId: any,
  overrides: Partial<FormData> = {}
) => {
  const defaultData = {
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123456',
    ...overrides,
  };

  fireEvent.changeText(
    getByTestId(TEST_IDS.AUTH_USERNAME_INPUT),
    defaultData.username
  );
  fireEvent.changeText(
    getByTestId(TEST_IDS.AUTH_EMAIL_INPUT),
    defaultData.email
  );
  fireEvent.changeText(
    getByTestId(TEST_IDS.AUTH_PASSWORD_INPUT),
    defaultData.password
  );

  return defaultData;
};

export const fillUpdateForm = (
  getByTestId: any,
  overrides: Partial<FormData> = {}
) => {
  const defaultData = {
    username: 'updateduser',
    email: 'updated@example.com',
    bio: 'Updated bio',
    image: 'https://example.com/new-avatar.jpg',
    password: '', // Added password field that was missing
    ...overrides,
  };

  fireEvent.changeText(
    getByTestId(TEST_IDS.EDIT_PROFILE_USERNAME_INPUT),
    defaultData.username
  );
  fireEvent.changeText(
    getByTestId(TEST_IDS.EDIT_PROFILE_EMAIL_INPUT),
    defaultData.email
  );
  fireEvent.changeText(
    getByTestId(TEST_IDS.EDIT_PROFILE_BIO_INPUT),
    defaultData.bio
  );
  fireEvent.changeText(
    getByTestId(TEST_IDS.EDIT_PROFILE_IMAGE_INPUT),
    defaultData.image
  );

  // Only fill password if it's provided (since it's optional in profile updates)
  if (defaultData.password !== '') {
    fireEvent.changeText(
      getByTestId(TEST_IDS.EDIT_PROFILE_PASSWORD_INPUT),
      defaultData.password
    );
  }

  return defaultData;
};

export const fillArticleForm = (
  getByTestId: any,
  overrides: Partial<FormData> = {}
) => {
  const defaultData = {
    title: 'Test Article Title',
    description: 'Test article description',
    body: 'This is the test article body content.',
    ...overrides,
  };

  fireEvent.changeText(
    getByTestId(TEST_IDS.ARTICLE_TITLE_INPUT),
    defaultData.title
  );
  fireEvent.changeText(
    getByTestId(TEST_IDS.ARTICLE_DESCRIPTION_INPUT),
    defaultData.description
  );
  fireEvent.changeText(
    getByTestId(TEST_IDS.ARTICLE_BODY_INPUT),
    defaultData.body
  );

  return defaultData;
};
