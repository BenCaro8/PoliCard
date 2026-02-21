import { useEffect, FC, useState } from 'react';
import { Text, StyleProp, TextStyle } from 'react-native';
import { Easing } from 'react-native-reanimated';

interface Props {
  value: number;
  delay?: number;
  duration?: number;
  style?: StyleProp<TextStyle>;
  easing?: (value: number) => number;
}

const AnimatedNumber: FC<Props> = ({
  value,
  delay = 0,
  duration = 10,
  style,
  easing = Easing.linear,
}) => {
  const [currentValue, setCurrentValue] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);

  useEffect(() => {
    let animationFrameId: number;

    const startAnimation = () => {
      setStartTime(Date.now());
      setCurrentValue(0); // Reset to 0 at the start

      const animate = () => {
        if (!startTime) return;

        const elapsedTime = Date.now() - startTime;
        const progress = Math.min(1, elapsedTime / (duration * 1000)); // Progress from 0 to 1
        const easedProgress = easing(progress); // Apply easing

        const newValue = Math.round(easedProgress * value); // Calculate current value
        setCurrentValue(newValue);

        if (progress < 1) {
          animationFrameId = requestAnimationFrame(animate);
        }
      };

      animationFrameId = requestAnimationFrame(animate);
    };

    const timeoutId = setTimeout(startAnimation, delay * 1000);

    return () => {
      clearTimeout(timeoutId);
      cancelAnimationFrame(animationFrameId);
      setStartTime(null); // Reset startTime on cleanup
    };
  }, [value, delay, duration, easing, startTime]);

  return <Text style={style}>{currentValue}</Text>;
};

export default AnimatedNumber;
