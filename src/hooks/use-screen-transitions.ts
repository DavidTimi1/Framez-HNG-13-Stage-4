import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

type SlideDirection = 'left' | 'right';

export const useScreenTransition = (direction?: SlideDirection) => {
  const fade = useRef(new Animated.Value(0)).current;
  const translate = useRef(new Animated.Value(0)).current;
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      fade.setValue(0);
      translate.setValue(direction ? (direction === 'left' ? 40 : -40) : 30);

      Animated.parallel([
        Animated.timing(fade, {
          toValue: 1,
          duration: 350,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(translate, {
          toValue: 0,
          useNativeDriver: true,
          speed: 14,
          bounciness: 6,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fade, {
          toValue: 0,
          duration: 250,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(translate, {
          toValue: direction ? (direction === 'left' ? -40 : 40) : 20,
          duration: 250,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isFocused, direction]);

  const transform =
    direction === 'left' || direction === 'right'
      ? [{ translateX: translate }]
      : [{ translateY: translate }];

  return {
    animatedStyle: {
      opacity: fade,
      transform,
    },
  };
};
