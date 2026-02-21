import { FC, useRef, memo, useState, useEffect, useMemo } from 'react';
import { PRIMARY_ACCENT_COLOR } from '../utils/shared/common';
import { NodeImage } from '@/__generated__/graphql';
import { useAppDispatch, useAppSelector } from '../utils/store';
import { fetchNodeImages } from '../utils/slices/nodes';
import { useSharedValue } from 'react-native-reanimated';
import { View, Image, Pressable, ActivityIndicator } from 'react-native';
import UploadImage from './UploadImage';
import Carousel, {
  ICarouselInstance,
  Pagination,
} from 'react-native-reanimated-carousel';
import { CarouselRenderItemInfo } from 'react-native-reanimated-carousel/lib/typescript/types';
import styles from './styles/ImageCarousel';

type Props = {
  nodeId: string;
  handleImagePress?: () => void;
  defaultIndex?: number;
  onIndexChange?: (
    index: number,
    uploadedBy?: string,
    imageId?: string,
  ) => void;
};

const ImageCarousel: FC<Props> = ({
  nodeId,
  handleImagePress,
  defaultIndex: defaultIndexProp = 0,
  onIndexChange,
}) => {
  const dispatch = useAppDispatch();
  const images = useAppSelector((state) => state.nodes.nodes[nodeId]?.images);

  useEffect(() => {
    if (!images?.length) {
      dispatch(fetchNodeImages({ nodeId, limit: 4, offset: 0 }));
    }
  }, [dispatch, images?.length, nodeId]);

  const data = useMemo(
    () => (images?.length ? [null, ...images] : [null]),
    [images],
  );
  const [width, setWidth] = useState(500);
  const ref = useRef<ICarouselInstance>(null);
  const initialMount = useRef(false);
  const progress = useSharedValue<number>(0);
  const defaultIndex = defaultIndexProp
    ? defaultIndexProp
    : data.length > 1
      ? 1
      : 0;

  useEffect(() => {
    if (onIndexChange && !initialMount.current) {
      const uploadedBy = data[defaultIndex]?.uploadedBy || undefined;
      const imageId = data[defaultIndex]?.imageId || undefined;
      onIndexChange(defaultIndex, uploadedBy, imageId);
    }
  }, [data, defaultIndex, onIndexChange]);

  const onPressPagination = (index: number) => {
    ref.current?.scrollTo({
      count: index - progress.value,
      animated: true,
    });
  };

  const renderItem = (
    value: CarouselRenderItemInfo<NodeImage | null | undefined>,
  ) => {
    const { index, item } = value;
    if (index === 0) {
      return <UploadImage nodeId={nodeId} noImages={data.length <= 1} />;
    }

    return (
      <Pressable onPress={handleImagePress}>
        <Image
          source={{ uri: item?.imageUrl || '' }}
          style={[styles.imageContainer, { height: width / 2 }]}
        />
      </Pressable>
    );
  };

  if (!images)
    return <ActivityIndicator size="large" color={PRIMARY_ACCENT_COLOR} />;

  return (
    <>
      <View
        style={styles.carouselContainer}
        onLayout={(event) => {
          if (!initialMount.current) {
            initialMount.current = true;
            setWidth(event.nativeEvent.layout.width);
          }
        }}
      >
        {initialMount.current && (
          <Carousel
            ref={ref}
            width={width - 1}
            height={width / 2}
            data={data}
            onProgressChange={progress}
            onScrollEnd={(index) => {
              const uploadedBy = data[index]?.uploadedBy || undefined;
              const imageId = data[index]?.imageId || undefined;
              if (onIndexChange) {
                onIndexChange(index, uploadedBy, imageId);
              }
            }}
            renderItem={renderItem}
            defaultIndex={defaultIndex}
            enabled={data.length > 1}
            loop={false}
          />
        )}
      </View>
      {data.length > 1 && (
        <Pagination.Basic
          progress={progress}
          data={data as []}
          dotStyle={{
            backgroundColor: 'rgba(255,255,255,0.2)',
            borderRadius: 50,
          }}
          activeDotStyle={{
            backgroundColor: 'rgba(255,255,255,0.9)',
            borderRadius: 50,
          }}
          containerStyle={{ gap: 5, marginTop: 10 }}
          onPress={onPressPagination}
        />
      )}
    </>
  );
};

export default memo(ImageCarousel);
