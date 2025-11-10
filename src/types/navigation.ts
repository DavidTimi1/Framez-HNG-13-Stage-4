import { NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

// Root Stack
export type RootStackParamList = {
  Auth: undefined;
  MainApp: undefined;
};

// Auth Stack
export type AuthStackParamList = {
  Login: undefined;
};

// Tab Navigator
export type TabParamList = {
  HomeTab: undefined;
  CreateTab: undefined;
  ProfileTab: undefined;
};

// Individual Tab Stacks
export type HomeStackParamList = {
  HomeFeed: undefined;
};

export type CreateStackParamList = {
  CreatePost: undefined;
};

export type ProfileStackParamList = {
  Profile: undefined;
};

// Navigation Props
export type RootNavigationProp = NativeStackNavigationProp<RootStackParamList>;
export type AuthNavigationProp = NativeStackNavigationProp<AuthStackParamList>;
export type TabNavigationProp = BottomTabNavigationProp<TabParamList>;
export type HomeNavigationProp = NativeStackNavigationProp<HomeStackParamList>;
export type CreateNavigationProp = NativeStackNavigationProp<CreateStackParamList>;
export type ProfileNavigationProp = NativeStackNavigationProp<ProfileStackParamList>;