import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthNavigator from './AuthNavigator';
import TabNavigator from './TabNavigator';
import { useAuthStore } from '../store/authStore';


export type RootStackParamList = {
    Auth: undefined;
    MainApp: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
    const loading = useAuthStore((s) => s.loading);
  
    if (loading) return null; // or splash screen

    return (
        <Stack.Navigator
            key={isAuthenticated ? 'app' : 'auth'}
            screenOptions={{ headerShown: false }}
        >
            {!isAuthenticated ? (
                <Stack.Screen name="Auth" component={AuthNavigator} />
            ) : (
                <Stack.Screen name="MainApp" component={TabNavigator} />
            )}
        </Stack.Navigator>
    );
};