import React from 'react';
import { Modal, View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

interface FoodImageProps {
  visible: boolean;
  imageUri: string | null;
  foodName: string;
  onClose: () => void;
}

const FoodImageModal: React.FC<FoodImageProps> = ({ visible, imageUri, foodName, onClose }) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose} // Close modal on back press
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {foodName && <Text style={styles.foodNameText}>{foodName}</Text>}
          {imageUri ? (
            <>
            <Image
              source={{ uri: imageUri }}
              style={styles.modalImage}
            />
            <Text style={styles.captionText}>Note: Images are AI generated and may not accurately represent the actual food served </Text>
            </>
            
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
    marginBottom: 10,
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
  captionText: {
    fontSize: 14,
    color: '#555',
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 10,
    maxWidth: 300,
  },
  foodNameText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#001F54',
    textAlign: 'center',
    marginBottom: 10,
  },
});

export default FoodImageModal;