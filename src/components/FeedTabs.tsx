import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native-ui-lib';

import { observer } from 'mobx-react';

import { FeedType } from '../constants/feedTypes';
import { componentStyles } from '../styles/componentStyles';
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
            const tabStyle = isActive
              ? componentStyles.feedTabsActiveTab
              : componentStyles.feedTabsInactiveTab;

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
