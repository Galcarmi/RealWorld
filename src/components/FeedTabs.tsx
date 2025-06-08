import { observer } from 'mobx-react';
import React from 'react';
import { StyleSheet } from 'react-native';
import { View, Text, TouchableOpacity } from 'react-native-ui-lib';

import { FeedType } from '../constants/feedTypes';
import { themeColors } from '../theme/colors';

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
    const tabs: Tab[] = [
      { id: FeedType.GLOBAL, label: 'For You', onPress: onGlobalFeedPress },
      { id: FeedType.FEED, label: 'Following', onPress: onUserFeedPress },
    ];

    return (
      <View paddingH-16 paddingT-16 paddingB-8>
        <View row>
          {tabs.map(tab => {
            const isActive = tab.id === feedType;
            const tabStyle = isActive ? styles.activeTab : styles.inactiveTab;

            return (
              <TouchableOpacity
                key={tab.id}
                onPress={tab.onPress}
                flex-1
                paddingV-12
                paddingH-16
                center
                style={[tabStyle]}
              >
                <Text text70 color={isActive ? activeColor : inactiveColor}>
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

const styles = StyleSheet.create({
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
});
