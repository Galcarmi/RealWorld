import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import { observer } from 'mobx-react';

import { FeedType } from '../constants/feedTypes';
import { COLORS, SPACINGS, DIMENSIONS, FONT_SIZES } from '../constants/styles';

interface Tab {
  id: string;
  label: string;
  onPress: () => void;
}

interface FeedTabsProps {
  feedType: FeedType;
  onGlobalFeedPress: () => void;
  onUserFeedPress: () => void;
  activeColor?: string;
  inactiveColor?: string;
}

export const FeedTabs: React.FC<FeedTabsProps> = observer(
  ({
    feedType,
    onGlobalFeedPress,
    onUserFeedPress,
    activeColor = COLORS.PRIMARY,
    inactiveColor = COLORS.PLACEHOLDER,
  }) => {
    const styles = useMemo(() => createStyles(), []);

    const tabs: Tab[] = [
      { id: FeedType.GLOBAL, label: 'For You', onPress: onGlobalFeedPress },
      { id: FeedType.FEED, label: 'Following', onPress: onUserFeedPress },
    ];

    return (
      <View style={styles.container}>
        {tabs.map(tab => {
          const isActive = tab.id === feedType;
          const tabStyle = isActive
            ? [styles.tab, styles.activeTab]
            : [styles.tab, styles.inactiveTab];

          return (
            <TouchableOpacity
              key={tab.id}
              onPress={tab.onPress}
              style={tabStyle}
            >
              <Text
                style={[
                  styles.tabLabel,
                  { color: isActive ? activeColor : inactiveColor },
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }
);

const createStyles = () =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      backgroundColor: COLORS.BACKGROUND,
      borderBottomWidth: DIMENSIONS.BORDER_WIDTH_THIN,
      borderBottomColor: COLORS.TAB_BAR_BORDER,
    },
    tab: {
      flex: 1,
      alignItems: 'center',
      paddingHorizontal: SPACINGS.TAB_PADDING_HORIZONTAL,
      paddingVertical: SPACINGS.TAB_PADDING_VERTICAL,
      borderBottomWidth: DIMENSIONS.BORDER_WIDTH_MEDIUM,
      borderBottomColor: 'transparent',
    },
    activeTab: {
      borderBottomColor: COLORS.PRIMARY,
    },
    inactiveTab: {
      borderBottomWidth: 0,
      marginRight: SPACINGS.MARGIN_TAB,
      marginLeft: SPACINGS.MARGIN_TAB,
    },
    tabLabel: {
      fontSize: FONT_SIZES.MEDIUM,
      color: COLORS.PLACEHOLDER,
    },
    activeTabLabel: {
      color: COLORS.PRIMARY,
    },
  });
