import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/stack';
import { colors, spacing, borderRadius } from '../theme/colors';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { api } from '../services/api';
import { useStore } from '../store/useStore';
import * as ImagePicker from 'expo-image-picker';

type SubmitBidScreenProps = {
  route: RouteProp<{ params: { jobId: string } }, 'params'>;
  navigation: NativeStackNavigationProp<any>;
};

export const SubmitBidScreen: React.FC<SubmitBidScreenProps> = ({ route, navigation }) => {
  const { jobId } = route.params || {};
  const [price, setPrice] = useState('');
  const [etaDays, setEtaDays] = useState('');
  const [note, setNote] = useState('');
  const [planPhoto, setPlanPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const currentJob = useStore((state) => state.currentJob);
  const setBids = useStore((state) => state.setBids);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setPlanPhoto(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!price.trim() || !etaDays.trim()) {
      Alert.alert('Error', 'Please fill in price and estimated completion time');
      return;
    }

    setLoading(true);
    try {
      await api.submitBid(jobId, {
        price: parseFloat(price),
        etaDays: parseInt(etaDays),
        note: note.trim(),
        planPhoto: planPhoto || undefined,
      });

      Alert.alert('Success', 'Your bid has been submitted successfully!', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to submit bid. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Job Summary</Text>
          {currentJob && (
            <>
              <Text style={styles.jobTitle}>{currentJob.title}</Text>
              <Text style={styles.jobDetail}>
                AI Estimate: {currentJob.aiEstimate.currency}{currentJob.aiEstimate.min.toLocaleString()} - {currentJob.aiEstimate.currency}{currentJob.aiEstimate.max.toLocaleString()}
              </Text>
            </>
          )}
        </Card>

        <Card style={styles.card}>
          <Text style={styles.label}>Your Quote ({currentJob?.aiEstimate.currency || '₹'}) *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your price"
            value={price}
            onChangeText={setPrice}
            keyboardType="number-pad"
          />

          <Text style={styles.label}>Estimated Completion Time (days) *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 3"
            value={etaDays}
            onChangeText={setEtaDays}
            keyboardType="number-pad"
          />

          <Text style={styles.label}>Tender Comment</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Explain why you're the right fit for this job, materials included, etc."
            value={note}
            onChangeText={setNote}
            multiline
            numberOfLines={4}
          />

          <Text style={styles.label}>Plan Photo (Optional)</Text>
          <TouchableOpacity style={styles.imageUpload} onPress={pickImage}>
            {planPhoto ? (
              <Image source={{ uri: planPhoto }} style={styles.uploadedImage} />
            ) : (
              <View style={styles.uploadPlaceholder}>
                <Text style={styles.uploadIcon}>📷</Text>
                <Text style={styles.uploadText}>Tap to upload plan photo</Text>
              </View>
            )}
          </TouchableOpacity>

          <Button
            title="Submit Bid"
            onPress={handleSubmit}
            loading={loading}
            style={styles.submitButton}
          />
        </Card>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
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
    marginTop: spacing.md,
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
  imageUpload: {
    height: 150,
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
  uploadIcon: {
    fontSize: 48,
    marginBottom: spacing.sm,
  },
  uploadText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  submitButton: {
    marginTop: spacing.xl,
  },
});