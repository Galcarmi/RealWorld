import React from 'react';
import { View } from 'react-native-ui-lib';

import { useRoute, RouteProp } from '@react-navigation/native';

import { noop } from 'lodash';
import { observer } from 'mobx-react-lite';
import { NavioScreen } from 'rn-navio';

import { themeColors } from '../../theme/colors';

import { RootStackParamList } from '../../navigation/types';
import { componentStyles } from '../../styles/componentStyles';

import { ArticlesList } from '../../components/ArticlesList';
import { AuthorProfileHeader } from '../../components/AuthorProfileHeader';
import { ScreenHeader } from '../../components/ScreenHeader';

import { useAuthorProfile } from './useAuthorProfile';

type AuthorProfileScreenRouteProp = RouteProp<
  RootStackParamList,
  'AuthorProfile'
>;

interface AuthorProfileScreenProps {}

export const AuthorProfileScreen: NavioScreen<AuthorProfileScreenProps> =
  observer(() => {
    const route = useRoute<AuthorProfileScreenRouteProp>();
    const username = route.params?.username || '';

    const {
      authorProfile,
      authorArticles,
      isLoading,
      onFollowToggle,
      onToggleFavorite,
      refreshAuthorArticles,
    } = useAuthorProfile(username);

    if (!authorProfile) {
      return (
        <View
          style={componentStyles.homeScreenSafeArea}
          testID='author-profile-screen'
        >
          <ScreenHeader showBackButton={true} />
        </View>
      );
    }

    return (
      <View
        style={componentStyles.homeScreenSafeArea}
        testID='author-profile-screen'
      >
        <ScreenHeader showBackButton={true} />

        <View
          style={componentStyles.profileScreenHeaderSection}
          backgroundColor={themeColors.secondaryColor}
          paddingH-20
        >
          <AuthorProfileHeader
            profile={authorProfile}
            onFollowToggle={onFollowToggle}
          />
        </View>

        <View style={componentStyles.profileScreenArticlesSection}>
          <ArticlesList
            articles={authorArticles}
            isLoading={isLoading}
            onRefresh={refreshAuthorArticles}
            onLoadMore={noop}
            onFavoritePress={onToggleFavorite}
            emptyMessage='No articles found'
            contextKey='author-profile'
          />
        </View>
      </View>
    );
  });
