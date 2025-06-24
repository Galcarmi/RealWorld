import React, { useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { Avatar, Button } from 'react-native-ui-lib';

import { Ionicons } from '@expo/vector-icons';

import { observer } from 'mobx-react';

import {
  COLORS,
  SPACINGS,
  TYPOGRAPHY,
  DIMENSIONS,
  FONT_WEIGHTS,
  FONT_SIZES,
} from '../../constants/styles';

import { TEST_IDS, APP_UI, ICON_NAMES } from '../../constants';
import { useTranslation } from '../../hooks/useTranslation';
import { Article } from '../../services';
import { getInitials, formatDate } from '../../utils';

interface ArticleHeaderProps {
  article: Article;
  onAuthorPress: () => void;
  onDelete?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
}

export const ArticleHeader: React.FC<ArticleHeaderProps> = observer(
  ({ article, onAuthorPress, onDelete, containerStyle }) => {
    const { t } = useTranslation();
    const styles = useMemo(() => createStyles(), []);

    const getDeleteButtonIcon = useCallback(() => {
      return (
        <Ionicons
          name={ICON_NAMES.TRASH_SHARP}
          size={APP_UI.ICON_SIZES.SMALL}
          color={COLORS.ERROR}
        />
      );
    }, []);

    const getEditButtonIcon = useCallback(() => {
      return (
        <Ionicons
          name={ICON_NAMES.CREATE_SHARP}
          size={APP_UI.ICON_SIZES.SMALL}
          color={COLORS.PRIMARY}
        />
      );
    }, []);

    return (
      <View style={[styles.container, containerStyle]}>
        <Text style={styles.title}>{article.title}</Text>

        <View style={styles.authorSection}>
          <TouchableOpacity onPress={onAuthorPress} style={styles.authorInfo}>
            <Avatar
              source={{ uri: article.author.image || undefined }}
              size={APP_UI.ICON_SIZES.AVATAR_MEDIUM}
              backgroundColor={COLORS.PLACEHOLDER}
              label={getInitials(article.author.username, 2)}
              labelColor={COLORS.BACKGROUND}
            />
            <View style={styles.authorTextInfo}>
              <Text style={styles.authorName}>{article.author.username}</Text>
              <Text style={styles.createdAt}>
                {formatDate(article.createdAt)}
              </Text>
            </View>
          </TouchableOpacity>

          <View style={styles.actionButtons}>
            <Button
              label={t('common.edit')}
              color={COLORS.PRIMARY}
              outline
              outlineColor={COLORS.PRIMARY}
              borderRadius={DIMENSIONS.BORDER_RADIUS_LARGE}
              style={styles.actionButton}
              size={'small'}
              iconSource={getEditButtonIcon}
              iconOnRight={false}
              testID={TEST_IDS.EDIT_ARTICLE_BUTTON}
            />

            <Button
              label={t('common.delete')}
              color={COLORS.ERROR}
              outline
              outlineColor={COLORS.ERROR}
              borderRadius={DIMENSIONS.BORDER_RADIUS_LARGE}
              style={styles.actionButton}
              labelStyle={[{ color: COLORS.ERROR }]}
              size={'small'}
              onPress={onDelete}
              iconSource={getDeleteButtonIcon}
              iconOnRight={false}
              testID={TEST_IDS.DELETE_ARTICLE_BUTTON}
            />
          </View>
        </View>
      </View>
    );
  }
);

const createStyles = () =>
  StyleSheet.create({
    container: {
      paddingBottom: SPACINGS.HEADER_BOTTOM,
      paddingTop: SPACINGS.HEADER_TOP,
    },
    title: {
      fontSize: FONT_SIZES.EXTRA_LARGE,
      fontWeight: FONT_WEIGHTS.BOLD,
      textAlign: 'left',
      flex: 1,
    },
    authorSection: {
      paddingTop: SPACINGS.MEDIUM,
      flex: 1,
    },
    authorInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    authorTextInfo: {
      marginLeft: SPACINGS.MEDIUM,
      flex: 1,
    },
    authorName: {
      fontSize: TYPOGRAPHY.BODY.fontSize,
      fontWeight: FONT_WEIGHTS.BOLD,
      color: COLORS.BLACK,
    },
    createdAt: {
      fontSize: TYPOGRAPHY.BODY.fontSize,
      color: COLORS.PLACEHOLDER,
      marginTop: 2,
    },
    actionButtons: {
      paddingTop: SPACINGS.MEDIUM,
      alignItems: 'center',
      flexDirection: 'row',
      gap: SPACINGS.SMALL,
      flex: 1,
    },
    actionButton: {
      paddingHorizontal: SPACINGS.MEDIUM,
      gap: SPACINGS.EXTRA_SMALL,
    },
  });
