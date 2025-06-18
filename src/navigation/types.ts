import { Ionicons } from '@expo/vector-icons';
import React, { ComponentProps } from 'react';

export type RootStackParamList = {
  Login: undefined;
  SignIn: undefined;
  Home: undefined;
  Favorites: undefined;
  Profile: undefined;
  EditProfile: undefined;
  AuthorProfile: { username: string };
  NewArticle: undefined;
};

export interface NavigationInstance {
  canGoBack: () => boolean;
  goBack: () => void;
}

// Icon Types
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

// Route Types
export type AuthorProfileRouteProp = {
  key: string;
  name: 'AuthorProfile';
  params: { username: string };
};

// Navigation Service Types
export interface NavigationServiceType {
  setNavioInstance: (instance: NavigationInstance) => void;
  navigateToScreen: (
    screenName: keyof RootStackParamList,
    params?: RootStackParamList[keyof RootStackParamList]
  ) => void;
  goBack: () => void;
}
