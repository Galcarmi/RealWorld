import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import { observer } from 'mobx-react';

import { FeedType } from '../constants/feedTypes';
import { themeColors } from '../constants/styles';

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
    activeColor = themeColors.primaryColor,
    inactiveColor = themeColors.placeholderColor,
  }) => {
    const styles = useMemo(() => createStyles(), []);

    const tabs: Tab[] = [
      { id: FeedType.GLOBAL, label: 'For You', onPress: onGlobalFeedPress },
      { id: FeedType.FEED, label: 'Following', onPress: onUserFeedPress },
    ];

    return (
      <View style={styles.container}>
        <View style={styles.tabsRow}>
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
                    styles.tabText,
                    { color: isActive ? activeColor : inactiveColor },
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  }
);

const createStyles = () =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 8,
    },
    tabsRow: {
      flexDirection: 'row',
    },
    tab: {
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: 16,
      alignItems: 'center',
    },
    activeTab: {
      borderBottomWidth: 2,
      borderBottomColor: themeColors.primaryColor,
      marginRight: 3,
      marginLeft: 3,
    },
    inactiveTab: {
      borderBottomWidth: 0,
      marginRight: 3,
      marginLeft: 3,
    },
    tabText: {
      fontSize: 16,
    },
  });
