import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

export function TypingIndicator() {
  const { theme } = useTheme();

  const dots = [0, 1, 2].map((index) => {
    const scale = new Animated.Value(0.8);

    React.useEffect(() => {
      const animation = Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.2,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 0.8,
          duration: 400,
          useNativeDriver: true,
        }),
      ]);

      const loop = Animated.loop(animation, { resetBeforeIteration: true });
      loop.start();

      return () => loop.stop();
    }, []);

    return (
      <Animated.View
        key={index}
        style={[
          styles.dot,
          {
            backgroundColor: theme.colors.primary,
            transform: [{ scale }],
            opacity: scale.interpolate({
              inputRange: [0.8, 1.2],
              outputRange: [0.5, 1],
            }),
          },
        ]}
      />
    );
  });

  return <View style={styles.container}>{dots}</View>;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
});
