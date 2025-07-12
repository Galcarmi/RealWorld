import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';

import { observer } from 'mobx-react';

import {
  COLORS,
  SPACINGS,
  DIMENSIONS,
  FONT_SIZES,
} from '../../constants/styles';

import { FeedType } from '../../constants';
import { useTranslation } from '../../hooks/useTranslation';

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
  containerStyle?: StyleProp<ViewStyle>;
}

export const FeedTabs: React.FC<FeedTabsProps> = observer(
  ({
    feedType,
    onGlobalFeedPress,
    onUserFeedPress,
    activeColor = COLORS.PRIMARY,
    inactiveColor = COLORS.PLACEHOLDER,
    containerStyle,
  }) => {
    const { t } = useTranslation();

    const tabs: Tab[] = [
      {
        id: FeedType.GLOBAL,
        label: t('feed.forYou'),
        onPress: onGlobalFeedPress,
      },
      {
        id: FeedType.FEED,
        label: t('feed.following'),
        onPress: onUserFeedPress,
      },
    ];

    return (
      <View style={[styles.container, containerStyle]}>
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
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.BACKGROUND,
    borderBottomWidth: DIMENSIONS.BORDER_WIDTH_THIN,
    borderBottomColor: COLORS.TAB_BAR_BORDER,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: SPACINGS.TAB_VERTICAL,
    borderBottomWidth: DIMENSIONS.BORDER_WIDTH_MEDIUM,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: COLORS.PRIMARY,
  },
  inactiveTab: {
    borderBottomWidth: 0,
    marginRight: SPACINGS.TAB,
    marginLeft: SPACINGS.TAB,
  },
  tabText: {
    fontSize: FONT_SIZES.MEDIUM,
    color: COLORS.PLACEHOLDER,
  },
});
