import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthNavigator from './AuthNavigator';
import TabNavigator from './TabNavigator';
import { useAuthStore } from '../store/authStore';
import { ConvexProvider, ConvexReactClient } from 'convex/react';


export type RootStackParamList = {
  Auth: undefined;
  MainApp: undefined;
};

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL);
const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const { isAuthenticated } = useAuthStore();

  return (
    <ConvexProvider client={convex}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        ) : (
          <Stack.Screen name="MainApp" component={TabNavigator} />
        )}
      </Stack.Navigator>
    </ConvexProvider>
  );
};