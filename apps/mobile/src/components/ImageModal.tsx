import { FC, useState, memo } from 'react';
import { useAppDispatch, useAppSelector } from '../utils/store';
import { deleteNodeImage } from '../utils/slices/nodes';
import { Modal, View, TouchableOpacity } from 'react-native';
import ImageCarousel from './ImageCarousel';
import Feather from '@expo/vector-icons/Feather';
import styles from './styles/ImageModal';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  nodeId: string;
  defaultIndex?: number;
};

const ImageModal: FC<Props> = ({ isOpen, onClose, nodeId, defaultIndex }) => {
  const dispatch = useAppDispatch();
  const id = useAppSelector((state) => state.user.user?.id);
  const [currentImageId, setCurrentImageId] = useState('');
  const [uploadedBy, setUploadedBy] = useState<string | undefined>(undefined);
  const uploadOwner = id === uploadedBy;

  const handleIndexChange = (
    _: number,
    uploader?: string,
    imageId?: string,
  ) => {
    setCurrentImageId(imageId || '');
    setUploadedBy(uploader);
  };

  return (
    <Modal visible={isOpen} transparent={true} onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.topUtilityRow}>
          {uploadOwner && (
            <TouchableOpacity
              onPress={() => {
                dispatch(deleteNodeImage({ imageId: currentImageId, nodeId }));
              }}
            >
              <View style={{}}>
                <Feather name="trash-2" size={24} color="red" />
              </View>
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          activeOpacity={1}
          style={styles.carouselContainer}
          onPress={onClose}
        >
          <ImageCarousel
            nodeId={nodeId}
            onIndexChange={handleIndexChange}
            defaultIndex={defaultIndex}
          />
        </TouchableOpacity>
        <View style={styles.topUtilityRow} />
      </View>
    </Modal>
  );
};

export default memo(ImageModal);
