import React, { useMemo } from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Avatar } from 'react-native-ui-lib';

import { Ionicons } from '@expo/vector-icons';

import { TEST_IDS, APP_UI, ICON_NAMES } from '../constants';
import {
  themeColors,
  SPACINGS,
  TYPOGRAPHY,
  FONT_SIZES,
} from '../constants/styles';
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
      marginBottom: SPACINGS.PADDING_MEDIUM,
    },
    authorInfo: {
      flex: 1,
      marginLeft: SPACINGS.PADDING_SMALL,
    },
    usernameRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    username: {
      fontSize: FONT_SIZES.MEDIUM,
      color: themeColors.textColor,
      marginBottom: SPACINGS.MARGIN_TINY,
      fontFamily: TYPOGRAPHY.BOLD.fontFamily,
    },
    followingIcon: {
      marginLeft: SPACINGS.MARGIN_SMALL,
      marginBottom: SPACINGS.MARGIN_TINY,
    },
    createdAt: {
      fontSize: FONT_SIZES.SMALL,
      color: themeColors.placeholderColor,
    },
    favoriteContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    favoritesCount: {
      fontSize: FONT_SIZES.SMALL,
      color: themeColors.placeholderColor,
      marginLeft: SPACINGS.PADDING_EXTRA_SMALL,
    },
  });
