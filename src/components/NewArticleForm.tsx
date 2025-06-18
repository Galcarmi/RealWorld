import React from 'react';
import { ScrollView } from 'react-native';
import { Button, View } from 'react-native-ui-lib';

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
      maxLength={100}
      minLength={1}
      validationMessage={['Title is required']}
      onChangeText={onTitleChange}
      containerStyle={componentStyles.newArticleFormTitleInput}
      testID='article-title-input'
    />
  );

  const createDescriptionInputField = () => (
    <InputField
      placeholder='Description'
      value={description}
      maxLength={200}
      minLength={1}
      validationMessage={['Description is required']}
      onChangeText={onDescriptionChange}
      containerStyle={componentStyles.newArticleFormDescriptionInput}
      testID='article-description-input'
    />
  );

  const createBodyInputField = () => (
    <InputField
      placeholder='Article text'
      value={body}
      maxLength={5000}
      minLength={1}
      validationMessage={['Article text is required']}
      onChangeText={onBodyChange}
      containerStyle={componentStyles.newArticleFormBodyInput}
      testID='article-body-input'
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
      borderRadius={8}
      paddingV-15
      disabled={!canPublish || isLoading}
      onPress={onPublishArticle}
      style={componentStyles.newArticleFormPublishButton}
      testID='publish-article-button'
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
