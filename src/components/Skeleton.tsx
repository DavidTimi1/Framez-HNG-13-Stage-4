import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Animated } from 'react-native';
import { THEME } from '../lib/theme';
import { LinearGradient } from 'expo-linear-gradient';


const { width, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const Skeleton: React.FC<{ style: any }> = ({ style }) => {
  const shimmerAnim = useRef(new Animated.Value(-1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      })
    ).start();
  }, [shimmerAnim]);

  const translateX = shimmerAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: [-width, width],
  });

  return (
    <View style={[style, styles.container]}>
      <Animated.View
        style={[
          styles.shimmerOverlay,
          { transform: [{ translateX }] },
        ]}
      >
        <LinearGradient
          colors={['transparent', 'rgba(255,255,255,0.3)', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        />
      </Animated.View>
    </View>
  )
};

const styles = StyleSheet.create({
  container: { overflow: "hidden" },
  content: { width: '100%', height: SCREEN_HEIGHT * 0.5, borderRadius: 24, backgroundColor: THEME.surface, marginBottom: 12, overflow: 'hidden' },
  footerButton: { width: 30, height: 30, borderRadius: 15, backgroundColor: THEME.surface },
  shimmerOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  gradient: {
    flex: 1,
    width: 200, // width of the moving shimmer
  },
});
