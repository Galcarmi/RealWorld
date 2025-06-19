import React, { useMemo } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { Button } from 'react-native-ui-lib';

import {
  FORM_LIMITS,
  TEST_IDS,
  VALIDATION_MESSAGES,
  BUTTON_LABELS,
  PLACEHOLDERS,
} from '../constants';
import { COLORS, DIMENSIONS, SPACINGS } from '../constants/styles';

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
  const styles = useMemo(() => createStyles(), []);

  const determineButtonBackgroundColor = () => {
    return canPublish ? COLORS.PRIMARY : COLORS.GREY;
  };

  const createTitleInputField = () => (
    <InputField
      placeholder={PLACEHOLDERS.TITLE}
      value={title}
      maxLength={FORM_LIMITS.ARTICLE_TITLE_MAX}
      minLength={FORM_LIMITS.ARTICLE_TITLE_MIN}
      validationMessage={[VALIDATION_MESSAGES.TITLE_REQUIRED]}
      onChangeText={onTitleChange}
      containerStyle={styles.titleInput}
      testID={TEST_IDS.ARTICLE_TITLE_INPUT}
    />
  );

  const createDescriptionInputField = () => (
    <InputField
      placeholder={PLACEHOLDERS.DESCRIPTION}
      value={description}
      maxLength={FORM_LIMITS.ARTICLE_DESCRIPTION_MAX}
      minLength={FORM_LIMITS.ARTICLE_DESCRIPTION_MIN}
      validationMessage={[VALIDATION_MESSAGES.DESCRIPTION_REQUIRED]}
      onChangeText={onDescriptionChange}
      containerStyle={styles.descriptionInput}
      testID={TEST_IDS.ARTICLE_DESCRIPTION_INPUT}
    />
  );

  const createBodyInputField = () => (
    <InputField
      placeholder={PLACEHOLDERS.ARTICLE_TEXT}
      value={body}
      maxLength={FORM_LIMITS.ARTICLE_BODY_MAX}
      minLength={FORM_LIMITS.ARTICLE_BODY_MIN}
      validationMessage={[VALIDATION_MESSAGES.ARTICLE_TEXT_REQUIRED]}
      onChangeText={onBodyChange}
      containerStyle={styles.bodyInput}
      testID={TEST_IDS.ARTICLE_BODY_INPUT}
    />
  );

  const createPublishButton = () => (
    <Button
      label={BUTTON_LABELS.PUBLISH}
      backgroundColor={determineButtonBackgroundColor()}
      color={COLORS.BACKGROUND}
      borderRadius={DIMENSIONS.BORDER_RADIUS_SMALL}
      paddingV-15
      disabled={!canPublish || isLoading}
      onPress={onPublishArticle}
      style={styles.publishButton}
      testID={TEST_IDS.PUBLISH_ARTICLE_BUTTON}
    />
  );

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps='handled'
    >
      <View style={styles.container}>
        {createTitleInputField()}
        {createDescriptionInputField()}
        {createBodyInputField()}
        {createPublishButton()}
      </View>
    </ScrollView>
  );
};

const createStyles = () =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    scrollView: {
      flex: 1,
    },
    contentContainer: {
      flexGrow: 1,
      padding: SPACINGS.PADDING_EXTRA_LARGE,
    },
    titleInput: {
      marginBottom: SPACINGS.FORM_SPACING,
    },
    descriptionInput: {
      marginBottom: SPACINGS.FORM_SPACING,
    },
    bodyInput: {
      marginBottom: SPACINGS.MARGIN_2X_EXTRA_LARGE,
      flex: 1,
    },
    publishButton: {
      marginTop: 'auto',
      marginBottom: SPACINGS.PADDING_EXTRA_LARGE,
    },
  });
