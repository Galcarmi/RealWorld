import React, { ComponentProps } from 'react';

import { Ionicons } from '@expo/vector-icons';

export type RootStackParamList = {
  Login: undefined;
  SignIn: undefined;
  Home: undefined;
  Favorites: undefined;
  Profile: undefined;
  EditProfile: undefined;
  AuthorProfile: { username: string };
  ArticleForm: { slug?: string };
  Article: { slug: string };
};

export interface NavigationInstance {
  canGoBack: () => boolean;
  goBack: () => void;
}

export type IoniconsName = ComponentProps<typeof Ionicons>['name'];

export interface TabIconProps {
  color: string;
  size: number;
}

export interface TabIconCreatorProps {
  iconName: IoniconsName;
  testId: string;
}

export interface TabOptions {
  title: string;
  tabBarIcon: (props: TabIconProps) => React.ReactElement;
}

export interface TabBarOptions {
  tabBarActiveTintColor: string;
  tabBarInactiveTintColor: string;
  tabBarStyle: {
    backgroundColor: string;
    borderTopWidth: number;
    borderTopColor: string;
  };
}

export type AuthorProfileRouteProp = {
  key: string;
  name: 'AuthorProfile';
  params: { username: string };
};

export interface NavigationServiceType {
  setNavioInstance: (instance: NavigationInstance) => void;
  navigateToScreen: (
    screenName: keyof RootStackParamList,
    params?: RootStackParamList[keyof RootStackParamList]
  ) => void;
  goBack: () => void;
}
