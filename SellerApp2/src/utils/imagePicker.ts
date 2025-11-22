import { Alert, PermissionsAndroid, Platform } from 'react-native';
import { 
  ImagePickerResponse, 
  launchImageLibrary, 
  launchCamera,
  MediaType,
  ImageLibraryOptions,
  CameraOptions 
} from 'react-native-image-picker';

export interface ImagePickerResult {
  uri: string;
  fileName?: string;
  type?: string;
  fileSize?: number;
}

const imagePickerOptions: ImageLibraryOptions & CameraOptions = {
  mediaType: 'photo' as MediaType,
  quality: 0.8,
  maxWidth: 800,
  maxHeight: 800,
  includeBase64: false,
};

// Request camera permission for Android
const requestCameraPermission = async (): Promise<boolean> => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'App needs camera permission to take photos',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  }
  return true;
};

// Show image picker options
export const showImagePickerOptions = (): Promise<ImagePickerResult | null> => {
  return new Promise((resolve) => {
    Alert.alert(
      'Select Profile Picture',
      'Choose how you want to select your profile picture',
      [
        {
          text: 'Camera',
          onPress: () => {
            openCamera().then(resolve).catch(() => resolve(null));
          },
        },
        {
          text: 'Gallery',
          onPress: () => {
            openGallery().then(resolve).catch(() => resolve(null));
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => resolve(null),
        },
      ]
    );
  });
};

// Open camera
const openCamera = async (): Promise<ImagePickerResult | null> => {
  const hasPermission = await requestCameraPermission();
  if (!hasPermission) {
    Alert.alert('Permission Denied', 'Camera permission is required to take photos');
    return null;
  }

  return new Promise((resolve) => {
    launchCamera(imagePickerOptions, (response: ImagePickerResponse) => {
      if (response.didCancel) {
        resolve(null);
        return;
      }

      if (response.errorMessage) {
        Alert.alert('Error', response.errorMessage);
        resolve(null);
        return;
      }

      if (response.assets && response.assets.length > 0) {
        const asset = response.assets[0];
        if (asset.uri) {
          const result: ImagePickerResult = {
            uri: asset.uri,
            fileName: asset.fileName,
            type: asset.type,
            fileSize: asset.fileSize,
          };
          resolve(result);
          return;
        }
      }

      resolve(null);
    });
  });
};

// Open gallery
const openGallery = (): Promise<ImagePickerResult | null> => {
  return new Promise((resolve) => {
    launchImageLibrary(imagePickerOptions, (response: ImagePickerResponse) => {
      if (response.didCancel) {
        resolve(null);
        return;
      }

      if (response.errorMessage) {
        Alert.alert('Error', response.errorMessage);
        resolve(null);
        return;
      }

      if (response.assets && response.assets.length > 0) {
        const asset = response.assets[0];
        if (asset.uri) {
          const result: ImagePickerResult = {
            uri: asset.uri,
            fileName: asset.fileName,
            type: asset.type,
            fileSize: asset.fileSize,
          };
          resolve(result);
          return;
        }
      }

      resolve(null);
    });
  });
};