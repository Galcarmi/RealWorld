import React from 'react';
import { ScrollView } from 'react-native';
import { Button, View } from 'react-native-ui-lib';

import { FORM_LIMITS, TEST_IDS } from '../constants';
import { DIMENSIONS } from '../constants/styles';
import { componentStyles } from '../styles/componentStyles';
import { themeColors } from '../theme/colors';

import { InputField } from './InputField';

interface NewArticleFormProps {
  title: string;
  description: string;
  body: string;
  isLoading: boolean;
  canPublish: boolean;
  onTitleChange: (text: string) => void;
  onDescriptionChange: (text: string) => void;
  onBodyChange: (text: string) => void;
  onPublishArticle: () => void;
}

export const NewArticleForm: React.FC<NewArticleFormProps> = ({
  title,
  description,
  body,
  isLoading,
  canPublish,
  onTitleChange,
  onDescriptionChange,
  onBodyChange,
  onPublishArticle,
}) => {
  const createTitleInputField = () => (
    <InputField
      placeholder='Title'
      value={title}
      maxLength={FORM_LIMITS.ARTICLE_TITLE_MAX}
      minLength={FORM_LIMITS.ARTICLE_TITLE_MIN}
      validationMessage={['Title is required']}
      onChangeText={onTitleChange}
      containerStyle={componentStyles.newArticleFormTitleInput}
      testID={TEST_IDS.ARTICLE_TITLE_INPUT}
    />
  );

  const createDescriptionInputField = () => (
    <InputField
      placeholder='Description'
      value={description}
      maxLength={FORM_LIMITS.ARTICLE_DESCRIPTION_MAX}
      minLength={FORM_LIMITS.ARTICLE_DESCRIPTION_MIN}
      validationMessage={['Description is required']}
      onChangeText={onDescriptionChange}
      containerStyle={componentStyles.newArticleFormDescriptionInput}
      testID={TEST_IDS.ARTICLE_DESCRIPTION_INPUT}
    />
  );

  const createBodyInputField = () => (
    <InputField
      placeholder='Article text'
      value={body}
      maxLength={FORM_LIMITS.ARTICLE_BODY_MAX}
      minLength={FORM_LIMITS.ARTICLE_BODY_MIN}
      validationMessage={['Article text is required']}
      onChangeText={onBodyChange}
      containerStyle={componentStyles.newArticleFormBodyInput}
      testID={TEST_IDS.ARTICLE_BODY_INPUT}
    />
  );

  const determineButtonBackgroundColor = () => {
    return canPublish ? themeColors.primaryColor : themeColors.greyColor;
  };

  const createPublishButton = () => (
    <Button
      label='Publish'
      backgroundColor={determineButtonBackgroundColor()}
      color={themeColors.bgColor}
      borderRadius={DIMENSIONS.BORDER_RADIUS_SMALL}
      paddingV-15
      disabled={!canPublish || isLoading}
      onPress={onPublishArticle}
      style={componentStyles.newArticleFormPublishButton}
      testID={TEST_IDS.PUBLISH_ARTICLE_BUTTON}
    />
  );

  return (
    <ScrollView
      style={componentStyles.newArticleFormScrollView}
      contentContainerStyle={componentStyles.newArticleFormContentContainer}
      keyboardShouldPersistTaps='handled'
    >
      <View flex>
        {createTitleInputField()}
        {createDescriptionInputField()}
        {createBodyInputField()}
        {createPublishButton()}
      </View>
    </ScrollView>
  );
};
