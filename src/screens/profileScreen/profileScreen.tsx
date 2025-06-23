import React, { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { View } from 'react-native-ui-lib';

import { noop } from 'lodash';
import { observer } from 'mobx-react-lite';

import { COLORS, DIMENSIONS, TYPOGRAPHY } from '../../constants/styles';

import {
  ArticlesList,
  NewArticleButton,
  ProfileHeader,
} from '../../components';
import { TEST_IDS } from '../../constants';
import { useTranslation } from '../../hooks/useTranslation';
import { User } from '../../types';

import { useProfile } from './useProfile';

interface ProfileScreenProps {}

export const ProfileScreen: React.FC<ProfileScreenProps> = observer(() => {
  const { t } = useTranslation();
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

  return (
    <View style={styles.container} testID={TEST_IDS.PROFILE_SCREEN}>
      <ProfileHeader
        user={currentUser as User}
        onEditProfile={onEditProfile}
        usernameStyle={styles.username}
        containerStyle={styles.headerSection}
      />
      <NewArticleButton
        onPress={onCreateNewArticle}
        containerStyle={styles.middleSection}
      />
      <ArticlesList
        articles={userArticles}
        isLoading={isLoading}
        onRefresh={refreshUserArticles}
        onLoadMore={noop}
        onArticlePress={noop}
        onFavoritePress={onToggleFavorite}
        emptyMessage={t('empty.noUserArticles')}
        contextKey='profile'
        containerStyle={styles.articlesSection}
      />
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
      flex: 0.3,
      backgroundColor: COLORS.SECONDARY,
      marginBottom: DIMENSIONS.SMALL,
    },
    middleSection: {
      flex: 0.1,
      alignSelf: 'center',
      justifyContent: 'center',
    },
    articlesSection: {
      flex: 0.57,
    },
    username: {
      fontSize: TYPOGRAPHY.TITLE.fontSize,
      color: COLORS.PRIMARY,
    },
  });
