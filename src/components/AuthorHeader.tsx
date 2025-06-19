import React, { useMemo } from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Avatar } from 'react-native-ui-lib';

import { Ionicons } from '@expo/vector-icons';

import { TEST_IDS, APP_UI, ICON_NAMES } from '../constants';
import { themeColors, SPACINGS } from '../constants/styles';
import { Profile } from '../services/types';
import { formatDate, getInitials } from '../utils';

interface AuthorHeaderProps {
  author: Profile;
  createdAt: string;
  favorited: boolean;
  favoritesCount: number;
  onFavorite: () => void;
}

export const AuthorHeader: React.FC<AuthorHeaderProps> = ({
  author,
  createdAt,
  favorited,
  favoritesCount,
  onFavorite,
}) => {
  const styles = useMemo(() => createStyles(), []);

  return (
    <View style={styles.container}>
      <Avatar
        source={{ uri: author.image || undefined }}
        size={APP_UI.ICON_SIZES.AVATAR_SMALL}
        backgroundColor={themeColors.placeholderColor}
        label={getInitials(author.username, 2)}
        labelColor={themeColors.bgColor}
        marginR-8
      />
      <View style={styles.authorInfo}>
        <View style={styles.usernameRow}>
          <Text style={styles.username}>{author.username}</Text>
          {author.following && (
            <Ionicons
              name={ICON_NAMES.CHECKMARK_CIRCLE}
              size={16}
              color={themeColors.primaryColor}
              style={styles.followingIcon}
            />
          )}
        </View>
        <Text style={styles.createdAt}>{formatDate(createdAt)}</Text>
      </View>
      <TouchableOpacity
        onPress={onFavorite}
        testID={TEST_IDS.FAVORITE_BUTTON(author.username)}
      >
        <View style={styles.favoriteContainer}>
          <Ionicons
            name={favorited ? ICON_NAMES.HEART : ICON_NAMES.HEART_OUTLINE}
            size={APP_UI.ICON_SIZES.MEDIUM}
            color={
              favorited ? themeColors.errorColor : themeColors.placeholderColor
            }
          />
          <Text style={styles.favoritesCount}>{favoritesCount}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const createStyles = () =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    authorInfo: {
      flex: 1,
      marginLeft: 8,
    },
    usernameRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    username: {
      fontSize: 16,
      color: themeColors.textColor,
      marginBottom: 2,
    },
    followingIcon: {
      marginLeft: SPACINGS.MARGIN_SMALL,
      marginBottom: SPACINGS.MARGIN_TINY,
    },
    createdAt: {
      fontSize: 14,
      color: themeColors.placeholderColor,
    },
    favoriteContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    favoritesCount: {
      fontSize: 14,
      color: themeColors.placeholderColor,
      marginLeft: 4,
    },
  });
