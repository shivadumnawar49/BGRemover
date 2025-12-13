import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, { useState } from 'react';
import { launchImageLibrary } from 'react-native-image-picker';
import { removeBackground } from 'react-native-background-remover';
import { SafeAreaView } from 'react-native-safe-area-context';

const HomeScreen = () => {
  const [imageURI, setImageURI] = useState<string | null>(null);
  const [bgRemovedURI, setBgRemovedURI] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const selectImage = async () => {
    const imagePickerResponse = await launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: 1,
      includeExtra: true,
    });

    const selectedImage = imagePickerResponse.assets?.[0];

    if (!selectedImage || !selectedImage.uri) {
      return;
    }

    setImageURI(selectedImage.uri);
  };

  const clearSelection = () => {
    setImageURI(null);
    setBgRemovedURI(null);
  };

  const removeSelectionBackround = async () => {
    if (!imageURI) {
      return;
    }

    setIsLoading(true);

    try {
      const backgroundRemovedImageURI = await removeBackground(imageURI);
      setBgRemovedURI(backgroundRemovedImageURI);
      console.log('removed backround image uri', backgroundRemovedImageURI);
    } catch (error) {
      console.error('Failed to remove background', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {imageURI ? (
        <View style={styles.container}>
          <View style={styles.imageWrapper}>
            {isLoading ? (
              <ActivityIndicator size={'large'} />
            ) : (
              <>
                {bgRemovedURI ? (
                  <Image
                    source={{ uri: bgRemovedURI }}
                    style={StyleSheet.absoluteFill}
                  />
                ) : (
                  <Image
                    source={{ uri: imageURI }}
                    style={StyleSheet.absoluteFill}
                  />
                )}
              </>
            )}
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={clearSelection}
              style={styles.secondaryButton}
              activeOpacity={0.7}
            >
              <Text style={styles.buttonText}>Clear Selection</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={removeSelectionBackround}
              style={styles.primaryButton}
              activeOpacity={0.7}
            >
              <Text style={styles.buttonText}>Remove Background</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        !imageURI && (
          <View style={styles.initialScreen}>
            <Text style={styles.headlineText}>
              Remove Background from Your Images
            </Text>

            <Text style={styles.subtitleText}>
              Pick any photo and remove its background instantly!
            </Text>

            <TouchableOpacity
              onPress={selectImage}
              style={styles.selectButton}
              activeOpacity={0.7}
            >
              <Text style={styles.buttonText}>Select Image</Text>
            </TouchableOpacity>
          </View>
        )
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  imageWrapper: {
    width: '100%',
    height: '50%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginTop: 30,
  },

  primaryButton: {
    paddingVertical: 12,
    paddingHorizontal: 22,
    backgroundColor: '#3B82F6',
    borderRadius: 10,
    elevation: 3,
  },

  secondaryButton: {
    paddingVertical: 12,
    paddingHorizontal: 22,
    backgroundColor: '#6B7280',
    borderRadius: 10,
    elevation: 3,
  },

  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },

  selectButton: {
    paddingVertical: 12,
    paddingHorizontal: 22,
    backgroundColor: '#10B981',
    borderRadius: 10,
    elevation: 3,
  },
  headlineText: {
    fontSize: 26,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 8,
  },

  subtitleText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 40, 
    lineHeight: 22,
  },

  initialScreen: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 20,
    paddingTop: 60,
    alignItems: 'center',
  },
});

export default HomeScreen;
