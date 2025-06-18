import React from 'react';
import { TouchableOpacity } from 'react-native';
import { View, Text, Avatar } from 'react-native-ui-lib';

import { Ionicons } from '@expo/vector-icons';

import { TEST_IDS, APP_UI, ICON_NAMES } from '../constants';
import { Profile } from '../services/types';
import { componentStyles } from '../styles/componentStyles';
import { themeColors } from '../theme/colors';
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
  return (
    <View row centerV marginB-12>
      <Avatar
        source={{ uri: author.image || undefined }}
        size={APP_UI.ICON_SIZES.AVATAR_SMALL}
        backgroundColor={themeColors.placeholderColor}
        label={getInitials(author.username, 2)}
        labelColor={themeColors.bgColor}
        marginR-8
      />
      <View flex marginL-8>
        <View row centerV>
          <Text text70 color={themeColors.textColor} marginB-2>
            {author.username}
          </Text>
          {author.following && (
            <Ionicons
              name={ICON_NAMES.CHECKMARK_CIRCLE}
              size={16}
              color={themeColors.primaryColor}
              style={componentStyles.authorFollowingIcon}
            />
          )}
        </View>
        <Text text80 color={themeColors.placeholderColor}>
          {formatDate(createdAt)}
        </Text>
      </View>
      <TouchableOpacity
        onPress={onFavorite}
        testID={TEST_IDS.FAVORITE_BUTTON(author.username)}
      >
        <View row centerV>
          <Ionicons
            name={favorited ? ICON_NAMES.HEART : ICON_NAMES.HEART_OUTLINE}
            size={APP_UI.ICON_SIZES.MEDIUM}
            color={
              favorited ? themeColors.errorColor : themeColors.placeholderColor
            }
          />
          <Text text80 color={themeColors.placeholderColor} marginL-4>
            {favoritesCount}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};
