import React, { useMemo } from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Avatar } from 'react-native-ui-lib';

import { Ionicons } from '@expo/vector-icons';

import {
  COLORS,
  SPACINGS,
  TYPOGRAPHY,
  FONT_SIZES,
} from '../../constants/styles';

import { TEST_IDS, APP_UI, ICON_NAMES } from '../../constants';
import { Profile } from '../../services';
import { formatDate, getInitials } from '../../utils';

interface AuthorHeaderProps {
  author: Profile;
  createdAt: string;
  favorited: boolean;
  onFavorite: () => void;
}

export const AuthorHeader: React.FC<AuthorHeaderProps> = ({
  author,
  createdAt,
  favorited,
  onFavorite,
}) => {
  const styles = useMemo(() => createStyles(), []);

  return (
    <View style={styles.container}>
      <Avatar
        source={{ uri: author.image || undefined }}
        size={APP_UI.ICON_SIZES.AVATAR_MEDIUM}
        backgroundColor={COLORS.PLACEHOLDER}
        label={getInitials(author.username, 2)}
        labelColor={COLORS.BACKGROUND}
      />
      <View style={styles.authorInfo}>
        <View style={styles.usernameRow}>
          <Text style={styles.username}>{author.username}</Text>
          {author.following && (
            <Ionicons
              name={ICON_NAMES.CHECKMARK_SHARP}
              size={18}
              color={COLORS.PRIMARY}
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
            color={COLORS.PRIMARY}
          />
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
      marginBottom: SPACINGS.MEDIUM,
    },
    authorInfo: {
      flex: 1,
      marginLeft: SPACINGS.MEDIUM,
    },
    usernameRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    username: {
      fontSize: FONT_SIZES.MEDIUM,
      color: COLORS.TEXT,
      marginBottom: SPACINGS['2_EXTRA_SMALL'],
      fontFamily: TYPOGRAPHY.BOLD.fontFamily,
    },
    followingIcon: {
      marginLeft: SPACINGS.SMALL,
      marginBottom: SPACINGS['2_EXTRA_SMALL'],
      textShadowColor: COLORS.PRIMARY,
      textShadowOffset: { width: 0, height: 0.2 },
      textShadowRadius: 0,
    },
    createdAt: {
      fontSize: FONT_SIZES.SMALL,
      color: COLORS.PLACEHOLDER,
    },
    favoriteContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    favoritesCount: {
      fontSize: FONT_SIZES.SMALL,
      color: COLORS.PLACEHOLDER,
      marginLeft: SPACINGS.EXTRA_SMALL,
    },
  });
