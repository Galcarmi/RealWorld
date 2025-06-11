import { observer } from 'mobx-react-lite';
import React from 'react';
import { SafeAreaView } from 'react-native';
import { NavioScreen } from 'rn-navio';

import { NewArticleForm } from '../../components/NewArticleForm';
import { NewArticleHeader } from '../../components/NewArticleHeader';
import { componentStyles } from '../../styles/componentStyles';

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
      <SafeAreaView style={componentStyles.homeScreenSafeArea}>
        <NewArticleHeader onGoBack={onGoBack} />

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
      </SafeAreaView>
    );
  }
);
