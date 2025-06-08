import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { View, Text, Avatar } from 'react-native-ui-lib';

import { Profile } from '../services/types';
import { themeColors } from '../theme/colors';
import { formatDate, getInitials } from '../utils';

interface AuthorHeaderProps {
  author: Profile;
  createdAt: string;
  favorited: boolean;
  favoritesCount: number;
  onFavorite?: () => void;
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
        size={32}
        backgroundColor={themeColors.placeholderColor}
        label={getInitials(author.username, 1)}
        labelColor={themeColors.bgColor}
      />
      <View flex marginL-8>
        <Text text70 color={themeColors.textColor} marginB-2>
          {author.username}
        </Text>
        <Text text80 color={themeColors.placeholderColor}>
          {formatDate(createdAt)}
        </Text>
      </View>
      <TouchableOpacity onPress={onFavorite}>
        <View row centerV>
          <Ionicons
            name={favorited ? 'heart' : 'heart-outline'}
            size={20}
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
