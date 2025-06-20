import React, { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { View } from 'react-native-ui-lib';

import { observer } from 'mobx-react-lite';
import { NavioScreen } from 'rn-navio';

import { COLORS, SPACINGS } from '../../constants/styles';

import { NewArticleForm } from '../../components/NewArticleForm';
import { ScreenHeader } from '../../components/ScreenHeader';
import { TEST_IDS } from '../../constants';

import { useNewArticle } from './useNewArticle';

interface NewArticleScreenProps {}

export const NewArticleScreen: NavioScreen<NewArticleScreenProps> = observer(
  () => {
    const {
      title,
      description,
      body,
      isLoading,
      canPublish,
      onTitleChange,
      onDescriptionChange,
      onBodyChange,
      onPublishArticle,
      onGoBack,
    } = useNewArticle();

    const styles = useMemo(() => createStyles(), []);

    return (
      <View style={styles.container} testID={TEST_IDS.NEW_ARTICLE_SCREEN}>
        <ScreenHeader
          title='New Article'
          showBackButton={true}
          onBackPress={onGoBack}
        />

        <NewArticleForm
          title={title}
          description={description}
          body={body}
          isLoading={isLoading}
          canPublish={canPublish}
          onTitleChange={onTitleChange}
          onDescriptionChange={onDescriptionChange}
          onBodyChange={onBodyChange}
          onPublishArticle={onPublishArticle}
          containerStyle={styles.formContainer}
        />
      </View>
    );
  }
);

const createStyles = () =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.BACKGROUND,
    },
    formContainer: {
      padding: SPACINGS.PADDING_EXTRA_LARGE,
    },
  });
