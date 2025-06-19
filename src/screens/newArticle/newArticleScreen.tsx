import React from 'react';
import { View } from 'react-native-ui-lib';

import { observer } from 'mobx-react-lite';
import { NavioScreen } from 'rn-navio';

import { componentStyles } from '../../styles/componentStyles';

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

    return (
      <View
        style={componentStyles.homeScreenSafeArea}
        testID={TEST_IDS.NEW_ARTICLE_SCREEN}
      >
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
        />
      </View>
    );
  }
);
