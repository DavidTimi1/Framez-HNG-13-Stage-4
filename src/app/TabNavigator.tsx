import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BlurView } from 'expo-blur';
import Animated, { useSharedValue, withTiming, useAnimatedStyle, interpolate, FadeInRight, FadeOutLeft } from 'react-native-reanimated';
import { Home, PlusSquare, User } from 'lucide-react-native';
import { CreatePost } from '../screens/CreatePost';
import { HomeFeed } from '../screens/HomeFeed';
import { ProfileScreen } from '../screens/ProfileScreen';
import { THEME } from '../lib/theme';

const { width } = Dimensions.get('window');

export type TabParamList = {
  HomeTab: undefined;
  CreateTab: undefined;
  ProfileTab: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

// Stacks
const Stack = createNativeStackNavigator();
const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HomeFeed" component={HomeFeed} />
  </Stack.Navigator>
);
const CreateStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="CreatePost" component={CreatePost} />
  </Stack.Navigator>
);
const ProfileStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Profile" component={ProfileScreen} />
  </Stack.Navigator>
);

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tab.Screen name="HomeTab" component={HomeStack} options={{ tabBarLabel: 'Home' }} />
      <Tab.Screen name="CreateTab" component={CreateStack} options={{ tabBarLabel: 'Create' }} />
      <Tab.Screen name="ProfileTab" component={ProfileStack} options={{ tabBarLabel: 'Profile' }} />
    </Tab.Navigator>
  );
}

interface CustomTabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

// 🔹 Custom Tab Bar
const CustomTabBar: React.FC<CustomTabBarProps> = ({ state, descriptors, navigation }) => {
  return (
    <View style={styles.navContainer}>
      <BlurView intensity={50} tint="dark" style={StyleSheet.absoluteFillObject} />

      <View style={styles.navContent}>
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const label = options.tabBarLabel ?? route.name;
          const isFocused = state.index === index;

          let Icon = Home;
          if (route.name === 'CreateTab') Icon = PlusSquare;
          if (route.name === 'ProfileTab') Icon = User;

          const progress = useSharedValue(isFocused ? 1 : 0);
          useEffect(() => {
            progress.value = withTiming(isFocused ? 1 : 0, { duration: 300 });
          }, [isFocused]);

          const animatedStyle = useAnimatedStyle(() => ({
            backgroundColor: isFocused ? THEME.primary : 'transparent',
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: interpolate(progress.value, [-1, 1], [0, 16]),
          }));

          const textStyle = useAnimatedStyle(() => ({
            opacity: progress.value,
            marginLeft: 8,
          }));

          return (
              <TouchableOpacity
                key={route.name}
                onPress={() => navigation.navigate(route.name)}
                activeOpacity={0.8}
              >
                <Animated.View style={[styles.navItem, animatedStyle]}>
                  <Icon size={30} color={isFocused ? '#fff' : THEME.textSecondary} />
                  {isFocused && (
                    <Animated.Text
                      style={[styles.navText]}
                    >
                      {label}
                    </Animated.Text>
                  )}
                </Animated.View>
              </TouchableOpacity>
            );
        })}
      </View>
    </View>
  );
};

const NAV_RADIUS = 45;
const NAV_PADDING = 10;

const styles = StyleSheet.create({
  navContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 30 : 20,
    left: '50%',
    borderRadius: NAV_RADIUS,
    overflow: 'hidden',
    backgroundColor: 'rgba(30, 30, 30, 0.5)',
    elevation: 8,
    transform: [{ translateX: "-50%" }],
  },
  navContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: NAV_PADDING,
    paddingVertical: NAV_PADDING,
    gap: 20,
  },
  navItem: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    borderRadius: NAV_RADIUS - NAV_PADDING,
  },
  navText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600'
  },
});
