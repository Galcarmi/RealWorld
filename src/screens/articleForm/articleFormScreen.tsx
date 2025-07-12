import React from 'react';
import { StyleSheet, ActivityIndicator } from 'react-native';
import { View } from 'react-native-ui-lib';

import { useRoute, RouteProp } from '@react-navigation/native';

import { observer } from 'mobx-react-lite';
import { NavioScreen } from 'rn-navio';

import { COLORS, SPACINGS } from '../../constants/styles';

import { RootStackParamList } from '../../navigation/types';

import { ArticleForm } from '../../components/articles/ArticleForm';
import { TEST_IDS } from '../../constants';

import { useArticleForm } from './useArticleForm';

interface ArticleFormScreenProps {}

type ArticleFormScreenRouteProp = RouteProp<RootStackParamList, 'ArticleForm'>;

export const ArticleFormScreen: NavioScreen<ArticleFormScreenProps> = observer(
  () => {
    const route = useRoute<ArticleFormScreenRouteProp>();
    const slug = route.params?.slug;

    const {
      title,
      description,
      body,
      isLoading,
      canPublish,
      onTitleChange,
      onDescriptionChange,
      onBodyChange,
      onFormSubmit,
    } = useArticleForm(slug);

    return (
      <View style={styles.container} testID={TEST_IDS.NEW_ARTICLE_SCREEN}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size='large' color={COLORS.PRIMARY} />
          </View>
        ) : (
          <ArticleForm
            title={title}
            description={description}
            body={body}
            isLoading={isLoading}
            canPublish={canPublish}
            onTitleChange={onTitleChange}
            onDescriptionChange={onDescriptionChange}
            onBodyChange={onBodyChange}
            onFormSubmit={onFormSubmit}
            containerStyle={styles.formContainer}
          />
        )}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    flex: 1,
    padding: SPACINGS.LARGE,
  },
});
