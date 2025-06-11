import { noop } from 'lodash';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View } from 'react-native-ui-lib';

import { ArticlesList } from '../../components/ArticlesList';
import { NewArticleButton } from '../../components/NewArticleButton';
import { ProfileHeader } from '../../components/ProfileHeader';
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
    onArticlePress,
    onToggleFavorite,
    refreshUserArticles,
  } = useProfile();

  if (!currentUser) {
    navigationService.navigateToLoginScreen();

    return null;
  }

  const handleArticlePress = (slug: string) => {
    const article = userArticles.find(a => a.slug === slug);
    if (article) {
      onArticlePress(article);
    }
  };

  return (
    <SafeAreaView style={componentStyles.homeScreenSafeArea}>
      <View
        style={componentStyles.profileScreenHeaderSection}
        paddingH-20
        backgroundColor={themeColors.secondaryColor}
      >
        <ProfileHeader user={currentUser} onEditProfile={onEditProfile} />
      </View>

      <View style={componentStyles.profileScreenArticlesSection} paddingH-20>
        <NewArticleButton onPress={onCreateNewArticle} />

        <ArticlesList
          articles={userArticles}
          isLoading={isLoading}
          onRefresh={refreshUserArticles}
          onLoadMore={noop}
          onArticlePress={handleArticlePress}
          onFavoritePress={onToggleFavorite}
          emptyMessage="No articles yet. Tap 'New Article' to create your first post"
          contextKey='profile'
        />
      </View>
    </SafeAreaView>
  );
});
