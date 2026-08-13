import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { colors, spacing, borderRadius } from '../theme/colors';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { api } from '../services/api';
import { useStore } from '../store/useStore';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const SKILLS = [
  'Electrician',
  'Plumber',
  'Mason',
  'Carpenter',
  'Painter',
  'Gardener',
  'General Labor',
  'Welder',
  'HVAC',
  'Roofer',
];

type OnboardingScreenProps = {
  navigation: NativeStackNavigationProp<any>;
};

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ navigation }) => {
  const [step, setStep] = useState<'form' | 'pending'>('form');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [serviceArea, setServiceArea] = useState('');
  const [serviceRadius, setServiceRadius] = useState('10');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [idProof, setIdProof] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const setWorker = useStore((state) => state.setWorker);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setIdProof(result.assets[0].uri);
    }
  };

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev =>
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const handleSubmit = async () => {
    if (!name.trim() || !phone.trim() || !serviceArea.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (selectedSkills.length === 0) {
      Alert.alert('Error', 'Please select at least one skill');
      return;
    }

    if (!idProof) {
      Alert.alert('Error', 'Please upload ID proof');
      return;
    }

    setLoading(true);
    try {
      const worker = await api.registerWorker({
        name,
        phone,
        skills: selectedSkills,
        serviceArea,
        serviceRadius: parseInt(serviceRadius) || 10,
        idProofUrl: idProof,
      });

      setWorker(worker);
      setStep('pending');
    } catch (error) {
      Alert.alert('Error', 'Failed to register. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'pending') {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>⏳</Text>
          </View>
          <Text style={styles.title}>Verification Pending</Text>
          <Text style={styles.description}>
            Your profile has been submitted for verification by the organization. 
            This usually takes 1-2 business days.
          </Text>
          <Card style={styles.infoCard}>
            <Text style={styles.infoLabel}>Name</Text>
            <Text style={styles.infoValue}>{name}</Text>
            <Text style={styles.infoLabel}>Skills</Text>
            <Text style={styles.infoValue}>{selectedSkills.join(', ')}</Text>
            <Text style={styles.infoLabel}>Service Area</Text>
            <Text style={styles.infoValue}>{serviceArea} ({serviceRadius} km radius)</Text>
          </Card>
          <Button
            title="Continue to App (Demo Mode)"
            onPress={() => navigation.replace('MainTabs')}
            style={styles.continueButton}
          />
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Worker Verification</Text>
        <Text style={styles.subtitle}>
          Complete your profile to start receiving job opportunities
        </Text>

        <Card style={styles.card}>
          <Text style={styles.label}>ID Proof *</Text>
          <TouchableOpacity style={styles.imageUpload} onPress={pickImage}>
            {idProof ? (
              <Image source={{ uri: idProof }} style={styles.uploadedImage} />
            ) : (
              <View style={styles.uploadPlaceholder}>
                <Text style={styles.uploadIcon}>📷</Text>
                <Text style={styles.uploadText}>Tap to upload ID</Text>
              </View>
            )}
          </TouchableOpacity>

          <Text style={styles.label}>Full Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your full name"
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.label}>Phone Number *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter phone number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />

          <Text style={styles.label}>Service Area *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., New York, NY"
            value={serviceArea}
            onChangeText={setServiceArea}
          />

          <Text style={styles.label}>Service Radius (km)</Text>
          <TextInput
            style={styles.input}
            placeholder="10"
            value={serviceRadius}
            onChangeText={setServiceRadius}
            keyboardType="number-pad"
          />

          <Text style={styles.label}>Skills *</Text>
          <View style={styles.skillsContainer}>
            {SKILLS.map((skill) => (
              <TouchableOpacity
                key={skill}
                style={[
                  styles.skillChip,
                  selectedSkills.includes(skill) && styles.skillChipSelected,
                ]}
                onPress={() => toggleSkill(skill)}
              >
                <Text
                  style={[
                    styles.skillText,
                    selectedSkills.includes(skill) && styles.skillTextSelected,
                  ]}
                >
                  {skill}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Button
            title="Submit for Verification"
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
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  card: {
    marginBottom: spacing.xl,
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
  uploadIcon: {
    fontSize: 48,
    marginBottom: spacing.sm,
  },
  uploadText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  skillChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  skillChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  skillText: {
    fontSize: 12,
    color: colors.text,
    fontWeight: '500',
  },
  skillTextSelected: {
    color: colors.background,
  },
  submitButton: {
    marginTop: spacing.xl,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
    alignSelf: 'center',
  },
  icon: {
    fontSize: 64,
  },
  description: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: 24,
  },
  infoCard: {
    marginBottom: spacing.xl,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    marginTop: spacing.md,
  },
  infoValue: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  continueButton: {
    marginTop: spacing.xl,
  },
});