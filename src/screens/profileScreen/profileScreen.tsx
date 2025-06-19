import React, { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { View } from 'react-native-ui-lib';

import { noop } from 'lodash';
import { observer } from 'mobx-react-lite';

import { COLORS } from '../../constants/styles';

import { ArticlesList } from '../../components/ArticlesList';
import { NewArticleButton } from '../../components/NewArticleButton';
import { ProfileHeader } from '../../components/ProfileHeader';
import { ScreenHeader } from '../../components/ScreenHeader';
import { TEST_IDS } from '../../constants';
import { navigationService } from '../../services';

import { useProfile } from './useProfile';

interface ProfileScreenProps {}

export const ProfileScreen: React.FC<ProfileScreenProps> = observer(() => {
  const {
    currentUser,
    userArticles,
    isLoading,
    onCreateNewArticle,
    onEditProfile,
    onToggleFavorite,
    refreshUserArticles,
  } = useProfile();

  const styles = useMemo(() => createStyles(), []);

  if (!currentUser) {
    navigationService.navigateToLoginScreen();

    return null;
  }

  return (
    <View style={styles.container} testID={TEST_IDS.PROFILE_SCREEN}>
      <ScreenHeader title='Profile' />

      <View
        style={styles.headerSection}
        backgroundColor={COLORS.SECONDARY}
        paddingH-20
      >
        <ProfileHeader user={currentUser} onEditProfile={onEditProfile} />
      </View>

      <View style={styles.articlesSection}>
        <NewArticleButton onPress={onCreateNewArticle} />

        <ArticlesList
          articles={userArticles}
          isLoading={isLoading}
          onRefresh={refreshUserArticles}
          onLoadMore={noop}
          onArticlePress={noop}
          onFavoritePress={onToggleFavorite}
          emptyMessage="No articles yet. Tap 'New Article' to create your first post"
          contextKey='profile'
        />
      </View>
    </View>
  );
});

const createStyles = () =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.BACKGROUND,
    },
    headerSection: {
      flex: 0.38,
    },
    articlesSection: {
      flex: 0.62,
    },
  });
