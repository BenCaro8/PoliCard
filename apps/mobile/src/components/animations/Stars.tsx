import { FC, useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
} from 'react-native-reanimated';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

type StarProps = {
  initialX: number;
  initialY: number;
  initialSize: number;
  initialOpacity: number;
};

const Star: FC<StarProps> = ({
  initialX,
  initialY,
  initialSize,
  initialOpacity,
}) => {
  const size = useSharedValue(initialSize);
  const opacity = useSharedValue(initialOpacity);

  useEffect(() => {
    // Animate size and opacity.  Make it more organic with slightly different timings.
    size.value = withRepeat(
      withSequence(
        withTiming(initialSize * (0.8 + Math.random() * 0.4), {
          duration: 500 + Math.random() * 500,
          easing: Easing.inOut(Easing.ease),
        }), // Range: 0.8 to 1.2
        withTiming(initialSize, {
          duration: 500 + Math.random() * 500,
          easing: Easing.inOut(Easing.ease),
        }),
      ),
      -1, // Repeat indefinitely
      true, // Reverse direction
    );

    opacity.value = withRepeat(
      withSequence(
        withTiming(initialOpacity * (0.6 + Math.random() * 0.4), {
          duration: 700 + Math.random() * 700,
          easing: Easing.inOut(Easing.quad),
        }), // Range 0.6 to 1.0
        withTiming(initialOpacity, {
          duration: 700 + Math.random() * 700,
          easing: Easing.inOut(Easing.quad),
        }),
      ),
      -1,
      true,
    );
  }, [initialOpacity, initialSize, opacity, size]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: size.value,
      height: size.value,
      opacity: opacity.value,
    };
  });

  return (
    <Animated.View
      style={[
        styles.star,
        {
          left: initialX,
          top: initialY,
        },
        animatedStyle,
      ]}
    />
  );
};

const TwinklingStars = () => {
  const [stars, setStars] = useState<
    {
      x: number;
      y: number;
      size: number;
      opacity: number;
    }[]
  >([]);

  useEffect(() => {
    const numStars = 50; // Adjust number of stars
    const starData = [];
    for (let i = 0; i < numStars; i++) {
      starData.push({
        x: Math.random() * screenWidth,
        y: Math.random() * screenHeight,
        size: 2 + Math.random() * 4, // Star size between 2 and 6
        opacity: 0.4 + Math.random() * 0.6, //initial opacity between 0.4 and 1
      });
    }
    setStars(starData);
  }, []);

  return (
    <View style={styles.container}>
      {stars.map((star, index) => (
        <Star
          key={index}
          initialX={star.x}
          initialY={star.y}
          initialSize={star.size}
          initialOpacity={star.opacity}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    position: 'absolute',
  },
  star: {
    position: 'absolute',
    backgroundColor: 'white',
    borderRadius: 100,
  },
});

export default TwinklingStars;
