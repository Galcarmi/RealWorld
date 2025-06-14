import { noop } from 'lodash';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { View } from 'react-native-ui-lib';

import { ArticlesList } from '../../components/ArticlesList';
import { NewArticleButton } from '../../components/NewArticleButton';
import { ProfileHeader } from '../../components/ProfileHeader';
import { ScreenHeader } from '../../components/ScreenHeader';
import { navigationService } from '../../services';
import { componentStyles } from '../../styles/componentStyles';
import { themeColors } from '../../theme/colors';

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

  if (!currentUser) {
    navigationService.navigateToLoginScreen();

    return null;
  }

  return (
    <View style={componentStyles.homeScreenSafeArea} testID='profile-screen'>
      <ScreenHeader title='Profile' />

      <View
        style={componentStyles.profileScreenHeaderSection}
        backgroundColor={themeColors.secondaryColor}
        paddingH-20
      >
        <ProfileHeader user={currentUser} onEditProfile={onEditProfile} />
      </View>

      <View style={componentStyles.profileScreenArticlesSection}>
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
