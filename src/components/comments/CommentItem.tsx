import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Avatar } from 'react-native-ui-lib';

import {
  COLORS,
  SPACINGS,
  TYPOGRAPHY,
  FONT_SIZES,
} from '../../constants/styles';

import { APP_UI } from '../../constants';
import { Comment } from '../../services';
import { formatDate, getInitials } from '../../utils';

interface CommentItemProps {
  comment: Comment;
}

export const CommentItem: React.FC<CommentItemProps> = ({ comment }) => {
  const styles = useMemo(() => createStyles(), []);

  return (
    <View style={styles.container}>
      <Avatar
        source={{ uri: comment.author.image || undefined }}
        size={APP_UI.ICON_SIZES.AVATAR_MEDIUM}
        backgroundColor={COLORS.PLACEHOLDER}
        label={getInitials(comment.author.username, 2)}
        labelColor={COLORS.BACKGROUND}
      />
      <View style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.username}>{comment.author.username}</Text>
          <Text style={styles.date}>{formatDate(comment.createdAt)}</Text>
        </View>
        <Text style={styles.body}>{comment.body}</Text>
      </View>
    </View>
  );
};

const createStyles = () =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      paddingVertical: SPACINGS.MEDIUM,
      paddingHorizontal: SPACINGS.LARGE,
      backgroundColor: COLORS.BACKGROUND,
    },
    contentContainer: {
      flex: 1,
      marginLeft: SPACINGS.MEDIUM,
    },
    headerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: SPACINGS.SMALL,
    },
    username: {
      fontSize: FONT_SIZES.MEDIUM,
      color: COLORS.TEXT,
      fontFamily: TYPOGRAPHY.BOLD.fontFamily,
      marginRight: SPACINGS.MEDIUM,
    },
    date: {
      fontSize: FONT_SIZES.SMALL,
      color: COLORS.PLACEHOLDER,
    },
    body: {
      fontSize: FONT_SIZES.MEDIUM,
      color: COLORS.TEXT,
      lineHeight: FONT_SIZES.MEDIUM,
    },
  });
