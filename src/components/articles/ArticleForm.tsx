import React, { useMemo } from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Button } from 'react-native-ui-lib';

import { observer } from 'mobx-react';

import { COLORS, DIMENSIONS, SPACINGS } from '../../constants/styles';

import { FORM_LIMITS, TEST_IDS } from '../../constants';
import { useTranslation } from '../../hooks/useTranslation';
import { InputField } from '../forms/InputField';

interface ArticleFormProps {
  title: string;
  description: string;
  body: string;
  isLoading: boolean;
  canPublish: boolean;
  onTitleChange: (text: string) => void;
  onDescriptionChange: (text: string) => void;
  onBodyChange: (text: string) => void;
  onFormSubmit: () => void;
  containerStyle?: StyleProp<ViewStyle>;
}

export const ArticleForm: React.FC<ArticleFormProps> = observer(
  ({
    title,
    description,
    body,
    isLoading,
    canPublish,
    onTitleChange,
    onDescriptionChange,
    onBodyChange,
    onFormSubmit,
    containerStyle,
  }) => {
    const { t } = useTranslation();
    const styles = useMemo(() => createStyles(), []);

    const determineButtonBackgroundColor = () => {
      return canPublish ? COLORS.PRIMARY : COLORS.GREY;
    };

    return (
      <View style={[styles.container, containerStyle]}>
        <InputField
          placeholder={t('placeholders.title')}
          value={title}
          maxLength={FORM_LIMITS.ARTICLE_TITLE_MAX}
          minLength={FORM_LIMITS.ARTICLE_TITLE_MIN}
          validationMessage={[t('validation.titleRequired')]}
          onChangeText={onTitleChange}
          containerStyle={styles.titleInput}
          testID={TEST_IDS.ARTICLE_TITLE_INPUT}
        />
        <InputField
          placeholder={t('placeholders.description')}
          value={description}
          maxLength={FORM_LIMITS.ARTICLE_DESCRIPTION_MAX}
          minLength={FORM_LIMITS.ARTICLE_DESCRIPTION_MIN}
          validationMessage={[t('validation.descriptionRequired')]}
          onChangeText={onDescriptionChange}
          containerStyle={styles.descriptionInput}
          testID={TEST_IDS.ARTICLE_DESCRIPTION_INPUT}
        />
        <InputField
          placeholder={t('placeholders.articleText')}
          value={body}
          maxLength={FORM_LIMITS.ARTICLE_BODY_MAX}
          minLength={FORM_LIMITS.ARTICLE_BODY_MIN}
          validationMessage={[t('validation.articleTextRequired')]}
          onChangeText={onBodyChange}
          containerStyle={styles.bodyInput}
          testID={TEST_IDS.ARTICLE_BODY_INPUT}
        />
        <Button
          label={t('common.publish')}
          backgroundColor={determineButtonBackgroundColor()}
          color={COLORS.BACKGROUND}
          borderRadius={DIMENSIONS.BORDER_RADIUS_SMALL}
          paddingV-15
          disabled={!canPublish || isLoading}
          onPress={onFormSubmit}
          style={styles.publishButton}
          testID={TEST_IDS.PUBLISH_ARTICLE_BUTTON}
        />
      </View>
    );
  }
);

const createStyles = () =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    contentContainer: {
      flexGrow: 1,
      padding: SPACINGS.EXTRA_LARGE,
    },
    titleInput: {
      marginBottom: SPACINGS.FORM,
    },
    descriptionInput: {
      marginBottom: SPACINGS.FORM,
    },
    bodyInput: {
      marginBottom: SPACINGS['2_EXTRA_LARGE'],
      flex: 1,
    },
    publishButton: {
      marginTop: 'auto',
      marginBottom: SPACINGS.EXTRA_LARGE,
      borderRadius: 0,
    },
  });
