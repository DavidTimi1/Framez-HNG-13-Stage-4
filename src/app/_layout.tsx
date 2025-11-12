import { ConvexProvider, ConvexReactClient } from 'convex/react';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import { Text, TextInput } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Toaster } from 'sonner-native';
import AppNavigator from './AppNavigator';

// 👇 Keep splash screen visible while we load resources
SplashScreen.preventAutoHideAsync().catch(() => {});


const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL || '');

export default function App() {
  const [fontsLoaded] = useFonts({
    PoppinsRegular: require('../assets/fonts/Poppins-Regular.ttf'),
    PoppinsBold: require('../assets/fonts/Poppins-Bold.ttf'),
    Calligraffitti_Regular: require('../assets/fonts/Calligraffitti-Regular.ttf'),
  });

  useEffect(() => {
    async function prepare() {
      try {
        // Keep splash screen visible while we load resources
        await SplashScreen.preventAutoHideAsync();
      } catch (e) {
        console.warn(e);
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync(); // hide splash screen once fonts are ready
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;
  
  if (Text.defaultProps == null) Text.defaultProps = {};
  if (TextInput.defaultProps == null) TextInput.defaultProps = {};

  // Global font for all Text & TextInput
  Text.defaultProps.style = { fontFamily: 'PoppinsRegular' };
  TextInput.defaultProps.style = { fontFamily: 'PoppinsRegular' };

  return (
    <ConvexProvider client={convex}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AppNavigator />
        <Toaster />
      </GestureHandlerRootView>
    </ConvexProvider>
  );
};