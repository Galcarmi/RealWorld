import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { observer } from 'mobx-react';

import { APP_UI } from '../constants';
import {
  COLORS,
  SPACINGS,
  TYPOGRAPHY,
  DIMENSIONS,
  FONT_SIZES,
} from '../constants/styles';
import { useTranslation } from '../hooks/useTranslation';

interface TagsListProps {
  tags: string[] | null;
  maxVisible?: number;
}

export const TagsList: React.FC<TagsListProps> = observer(
  ({ tags, maxVisible = APP_UI.MAX_VISIBLE_TAGS }) => {
    const { t } = useTranslation();
    const tagList = useMemo(() => tags || [], [tags]);

    const styles = useMemo(() => createStyles(), []);

    const visibleTags = useMemo(
      () => tagList.slice(0, maxVisible),
      [tagList, maxVisible]
    );

    const hiddenCount = tagList.length - maxVisible;

    if (tagList.length === 0) {
      return null;
    }

    return (
      <View style={styles.container}>
        {visibleTags.map((tag, index) => (
          <View key={index} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}

        {hiddenCount > 0 && (
          <Text style={styles.moreText}>
            +{hiddenCount} {t('tags.more')}
          </Text>
        )}
      </View>
    );
  }
);

const createStyles = () =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: SPACINGS.PADDING_MEDIUM,
    },
    tag: {
      paddingVertical: SPACINGS.PADDING_SMALL,
      paddingHorizontal: SPACINGS.PADDING_MEDIUM,
      marginRight: SPACINGS.PADDING_SMALL,
      backgroundColor: COLORS.SECONDARY,
      borderRadius: DIMENSIONS.BORDER_RADIUS_MEDIUM,
    },
    tagText: {
      fontSize: FONT_SIZES.X_SMALL,
      color: COLORS.PRIMARY,
      fontFamily: TYPOGRAPHY.BOLD.fontFamily,
    },
    moreText: {
      fontSize: FONT_SIZES.X_SMALL,
      color: COLORS.PLACEHOLDER,
    },
  });
