import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/stack';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { colors, spacing, borderRadius } from '../theme/colors';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { api } from '../services/api';
import { useStore } from '../store/useStore';

type UploadProofScreenProps = {
  route: RouteProp<{ params: { jobId: string } }, 'params'>;
  navigation: NativeStackNavigationProp<any>;
};

export const UploadProofScreen: React.FC<UploadProofScreenProps> = ({ route, navigation }) => {
  const { jobId } = route.params || {};
  const [photo, setPhoto] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [facing, setFacing] = useState<'back' | 'front'>('back');
  const [showCamera, setShowCamera] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  const currentJob = useStore((state) => state.currentJob);
  const updateJobStatus = useStore((state) => state.updateJobStatus);

  const takePicture = async () => {
    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) {
        Alert.alert('Permission denied', 'Camera permission is required');
        return;
      }
    }
    setShowCamera(true);
  };

  const handleCameraCapture = async () => {
    // In a real app, this would capture from CameraView
    // For demo, we'll use image picker
    setShowCamera(false);
    pickImage();
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!photo) {
      Alert.alert('Photo Required', 'Please capture or upload at least one "after" photo');
      return;
    }

    setLoading(true);
    try {
      await api.submitProof(jobId, {
        photoUrl: photo,
        note: note.trim() || undefined,
      });

      updateJobStatus(jobId, 'Submitted');

      Alert.alert('Success', 'Completion proof submitted for AI verification', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('Verification', { jobId }),
        },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to submit proof. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (showCamera) {
    return (
      <View style={styles.cameraContainer}>
        <CameraView style={styles.camera} facing={facing}>
          <View style={styles.cameraOverlay}>
            <TouchableOpacity
              style={styles.cameraButton}
              onPress={handleCameraCapture}
            >
              <View style={styles.cameraButtonInner} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowCamera(false)}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
        </CameraView>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Job Summary</Text>
          {currentJob && (
            <>
              <Text style={styles.jobTitle}>{currentJob.title}</Text>
              <Text style={styles.jobDetail}>
                {currentJob.location.address}
              </Text>
            </>
          )}
        </Card>

        <Card style={styles.card}>
          <Text style={styles.label}>Completion Photo *</Text>
          <Text style={styles.labelNote}>
            Capture a clear "after" photo showing the completed work
          </Text>
          
          <TouchableOpacity style={styles.imageUpload} onPress={takePicture}>
            {photo ? (
              <Image source={{ uri: photo }} style={styles.uploadedImage} />
            ) : (
              <View style={styles.uploadPlaceholder}>
                <Ionicons name="camera" size={48} color={colors.primary} />
                <Text style={styles.uploadText}>Tap to capture photo</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.galleryButton} onPress={pickImage}>
            <Text style={styles.galleryButtonText}>Or choose from gallery</Text>
          </TouchableOpacity>
        </Card>

        <Card style={styles.card}>
          <Text style={styles.label}>Notes (Optional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Add any notes about the completed work..."
            value={note}
            onChangeText={setNote}
            multiline
            numberOfLines={4}
          />
        </Card>

        <Button
          title="Submit for Verification"
          onPress={handleSubmit}
          loading={loading}
          disabled={!photo}
          style={styles.submitButton}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: spacing.xl,
  },
  cameraButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  cameraButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.background,
  },
  closeButton: {
    position: 'absolute',
    top: spacing.xl,
    right: spacing.xl,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: colors.background,
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    padding: spacing.lg,
  },
  card: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.md,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  jobDetail: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  labelNote: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  imageUpload: {
    height: 200,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
  },
  uploadPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
  },
  uploadText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
  galleryButton: {
    marginTop: spacing.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  galleryButtonText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  input: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    minHeight: 56,
  },
});