import { FC, useState } from 'react';
import { View, Text, Alert, Pressable } from 'react-native';
import { FormattedMessage } from 'react-intl';
import * as ImagePicker from 'expo-image-picker';
import { fetchNodeImages, updateNodeImage } from '../utils/slices/nodes';
import { useAppDispatch } from '../utils/store';
import { useMutation } from '@apollo/client';
import { ReactNativeFile } from '@/src/utils/apollo';
import Feather from '@expo/vector-icons/Feather';
import AntDesign from '@expo/vector-icons/AntDesign';
import BottomDrawer from './BottomDrawer';
import styles from './styles/UploadImage';
import { gql } from '@gql';

type Props = {
  nodeId: string;
  noImages?: boolean;
  type?: 'message' | 'carousel';
};

const UPLOAD_IMAGE_MUTATION = gql(`
  mutation UploadImage($id: ID!, $file: Upload!) {
    uploadImage(id: $id, file: $file)
  }
`);

const UploadImage: FC<Props> = ({
  nodeId,
  noImages = false,
  type = 'carousel',
}) => {
  const [uploadDrawerOpen, setUploadDrawerOpen] = useState(false);
  const [uploadImage, { error: uploadImageError }] = useMutation(
    UPLOAD_IMAGE_MUTATION,
  );
  const dispatch = useAppDispatch();

  const handlePushUpload = () => setUploadDrawerOpen(true);

  const handleSelectOption = async (source: 'camera' | 'gallery') => {
    let result: ImagePicker.ImagePickerResult;

    if (source === 'camera') {
      result = await ImagePicker.launchCameraAsync({
        quality: 1,
      });
    } else {
      result = await ImagePicker.launchImageLibraryAsync({
        quality: 1,
      });
    }

    if (!result.canceled && result.assets.length > 0) {
      const imageUri = result.assets[0].uri;
      uploadImageAsync(imageUri);
    }
  };

  const uploadImageAsync = async (imageUri: string) => {
    try {
      const file = new ReactNativeFile({
        uri: imageUri,
        type: 'image/jpeg',
        name: `${nodeId}.jpg`,
      });

      const { data } = await uploadImage({ variables: { id: nodeId, file } });

      if (data?.uploadImage) {
        dispatch(updateNodeImage({ id: nodeId, imageFile: data.uploadImage }));
        dispatch(fetchNodeImages({ nodeId, limit: 4, offset: 0 }));
      }
    } catch (error) {
      Alert.alert('Upload Failed', 'There was a problem uploading your image.');
      console.error('Upload Error:', error);
    }
  };

  if (uploadImageError) {
    console.error(uploadImageError);
  }

  const content = noImages ? (
    <>
      <Text style={styles.text}>
        <FormattedMessage
          id="UploadImage.noPics"
          defaultMessage="This item has no pictures."
        />
      </Text>
      <View style={styles.iconContainer}>
        <Feather name="camera" size={50} color="white" />
      </View>
      <Text style={styles.text}>
        <FormattedMessage
          id="UploadImage.noPics.uploadPrompt"
          defaultMessage="Upload an image to claim this place with your flag!"
        />
      </Text>
    </>
  ) : (
    <>
      <View style={styles.iconContainer}>
        <AntDesign name="plus" size={50} color="white" />
      </View>
      <Text style={styles.text}>
        <FormattedMessage
          id="UploadImage.pics.uploadPrompt"
          defaultMessage="Upload an image!"
        />
      </Text>
    </>
  );

  return (
    <>
      <Pressable onPress={handlePushUpload}>
        <View
          style={[
            styles.noImageContainer,
            type === 'carousel' && styles.carousel,
          ]}
        >
          {content}
        </View>
      </Pressable>
      <BottomDrawer
        isVisible={uploadDrawerOpen}
        onClose={() => setUploadDrawerOpen(false)}
        onSelect={handleSelectOption}
      />
    </>
  );
};

export default UploadImage;
