import { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet } from 'react-native';

const TypingIndicator = () => {
  const dot1Anim = useRef(new Animated.Value(0)).current;
  const dot2Anim = useRef(new Animated.Value(0)).current;
  const dot3Anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const createAnimation = (animation: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(animation, {
            toValue: 1,
            duration: 300,
            delay,
            useNativeDriver: true,
          }),
          Animated.timing(animation, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
      );
    };

    const animation1 = createAnimation(dot1Anim, 0);
    const animation2 = createAnimation(dot2Anim, 150);
    const animation3 = createAnimation(dot3Anim, 300);

    animation1.start();
    animation2.start();
    animation3.start();

    return () => {
      animation1.stop();
      animation2.stop();
      animation3.stop();
    };
  }, [dot1Anim, dot2Anim, dot3Anim]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.dot,
          { opacity: dot1Anim, transform: [{ scale: dot1Anim }] },
        ]}
      />
      <Animated.View
        style={[
          styles.dot,
          { opacity: dot2Anim, transform: [{ scale: dot2Anim }] },
        ]}
      />
      <Animated.View
        style={[
          styles.dot,
          { opacity: dot3Anim, transform: [{ scale: dot3Anim }] },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 20,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 5,
    backgroundColor: 'white',
    marginHorizontal: 5,
  },
});

export default TypingIndicator;
