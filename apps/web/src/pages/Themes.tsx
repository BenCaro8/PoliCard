import { FC, useState, useEffect } from 'react';
import { ChromePicker, ColorResult } from 'react-color';
import AnimatedBackground from '../components/AnimatedBackground';
import Section from '../components/Section';
import Title from '../components/Title';
import { useAppSelector, useAppDispatch } from '../store';
import {
  setColors,
  resetToDefaultTheme,
  setNumShapes,
} from '../slices/settings';
import { ColorState } from '../utils/helpers';
import { FormattedMessage } from 'react-intl';

const Themes: FC = () => {
  const isMobile = useAppSelector((state) => state.settings.isMobile);
  const colors = useAppSelector((state) => state.settings.colors);
  const numShapes = useAppSelector((state) => state.settings.numShapes);
  const [inputValue, setInputValue] = useState(numShapes.toString());
  const dispatch = useAppDispatch();

  const onColorChange = (color: ColorResult, property: keyof ColorState) => {
    dispatch(setColors({ [property]: color.hex }));
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (
      /^\d*$/.test(value) &&
      (parseInt(value) || 1) <= (isMobile ? 35 : 100)
    ) {
      setInputValue(value);
    }
  };

  const handleApplyClick = () => {
    const newCount = parseInt(inputValue);
    if (!isNaN(newCount)) {
      dispatch(setNumShapes(newCount));
    }
  };

  useEffect(() => {
    setInputValue(numShapes.toString());
  }, [numShapes]);

  return (
    <>
      <Section backgroundColor="primary-accent-color" height={200}>
        <Title fontFamily="Gugi" size="medium" center>
          <FormattedMessage id="Themes.title" defaultMessage="Themes:" />
        </Title>
      </Section>
      <Section flexCol showAnimatedBackground>
        <div className="text-white mt-10 mb-10">
          <div className="text-white mb-2">
            <FormattedMessage
              id="Themes.bgColor"
              defaultMessage="Background Color:"
            />
          </div>
          <ChromePicker
            color={colors['--primary-bg-color']}
            onChange={(color) => onColorChange(color, '--primary-bg-color')}
          />
        </div>
      </Section>
      <Section
        showAnimatedBackground
        flexCol
        backgroundColor="primary-gradient-color"
        gradient="secondary-accent-color"
      >
        <div className="text-white mt-10 mb-10">
          <div className="text-white mb-2">
            <FormattedMessage
              id="Themes.gradientColor"
              defaultMessage="Gradient Color:"
            />
          </div>

          <ChromePicker
            color={colors['--primary-gradient-color']}
            onChange={(color) =>
              onColorChange(color, '--primary-gradient-color')
            }
          />
        </div>
      </Section>
      <Section
        showAnimatedBackground
        flexCol
        backgroundColor="primary-accent-color"
      >
        <div className="text-white mt-10 mb-10">
          <div className="text-white mb-2">
            <FormattedMessage
              id="Themes.accentColor"
              defaultMessage="Accent Color:"
            />
          </div>

          <ChromePicker
            color={colors['--primary-accent-color']}
            onChange={(color) => onColorChange(color, '--primary-accent-color')}
          />
        </div>
      </Section>
      <Section
        showAnimatedBackground
        flexCol
        backgroundColor="secondary-accent-color"
      >
        <div className="text-white mt-10 mb-10">
          <div className="text-white mb-2">
            <FormattedMessage
              id="Themes.secondAccentColor"
              defaultMessage="Second Accent Color:"
            />
          </div>

          <ChromePicker
            color={colors['--secondary-accent-color']}
            onChange={(color) =>
              onColorChange(color, '--secondary-accent-color')
            }
          />
        </div>
      </Section>
      <Section flexCol style="py-5" showAnimatedBackground>
        <div className="mb-10">
          <div className="text-white flex flex-col mb-2">
            <FormattedMessage
              id="Themes.bgShapeNum"
              defaultMessage="Number of Background Shapes:"
            />
          </div>
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            className="pl-2"
          />
          <button onClick={handleApplyClick} className="text-white ml-2">
            <FormattedMessage id="Themes.apply" defaultMessage="Apply" />
          </button>
        </div>
        <div className="mb-10">
          <button
            onClick={() => dispatch(resetToDefaultTheme())}
            className="text-white ml-2"
          >
            <FormattedMessage id="Themes.reset" defaultMessage="Reset" />
          </button>
        </div>
      </Section>
      <AnimatedBackground />
    </>
  );
};

export default Themes;
