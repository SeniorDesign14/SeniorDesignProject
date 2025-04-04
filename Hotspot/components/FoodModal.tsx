import React from 'react';
import { Modal, View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

interface FoodImageProps {
  visible: boolean;
  imageUri: string | null;
  onClose: () => void;
}

const FoodImageModal: React.FC<FoodImageProps> = ({ visible, imageUri, onClose }) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose} // Close modal on back press
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {imageUri ? (
            <Image
              source={{ uri: imageUri }}
              style={styles.modalImage}
            />
          ) : (
            <Text style={styles.noImageText}>No image available for this item.</Text>
          )}
          <TouchableOpacity
            onPress={onClose} // Close modal on button press
            style={styles.closeButton}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#001F54',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  noImageText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default FoodImageModal;