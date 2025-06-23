import React, { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { View } from 'react-native-ui-lib';

import { useRoute, RouteProp } from '@react-navigation/native';

import { noop } from 'lodash';
import { observer } from 'mobx-react-lite';
import { NavioScreen } from 'rn-navio';

import { COLORS } from '../../constants/styles';

import { RootStackParamList } from '../../navigation/types';

import { ArticlesList, AuthorProfileHeader } from '../../components';
import { TEST_IDS } from '../../constants';

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

    const styles = useMemo(() => createStyles(), []);

    if (!authorProfile) {
      return (
        <View style={styles.container} testID={TEST_IDS.AUTHOR_PROFILE_SCREEN}>
          {/* Loading state - native header will handle back button */}
        </View>
      );
    }

    return (
      <View style={styles.container} testID={TEST_IDS.AUTHOR_PROFILE_SCREEN}>
        <View
          style={styles.headerSection}
          backgroundColor={COLORS.SECONDARY}
          paddingH-20
        >
          <AuthorProfileHeader
            profile={authorProfile}
            onFollowToggle={onFollowToggle}
          />
        </View>

        <View style={styles.articlesSection}>
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

const createStyles = () =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.BACKGROUND,
    },
    headerSection: {
      flex: 0.32,
    },
    articlesSection: {
      flex: 0.68,
    },
  });
