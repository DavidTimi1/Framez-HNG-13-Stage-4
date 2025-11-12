import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthNavigator from './AuthNavigator';
import TabNavigator from './TabNavigator';
import { useAuthStore } from '../store/authStore';
import { UserProfileModal } from '@/screens/UserProfileModal';


export type RootStackParamList = {
    Auth: undefined;
    MainApp: undefined;
    UserProfileModal: { userId: string; userName: string  };
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
                <>
                    <Stack.Screen name="MainApp" component={TabNavigator} />
                    <Stack.Screen
                        name="UserProfileModal"
                        component={UserProfileModal}
                        options={{
                            presentation: 'modal', // still overlaying the current screen
                            headerShown: false,
                            animation: 'slide_from_right', // <- slides in from right
                            gestureEnabled: true,
                            gestureDirection: 'horizontal', // <- swiping back horizontally
                        }}
                    />
                </>
            )}
        </Stack.Navigator>
    );
};