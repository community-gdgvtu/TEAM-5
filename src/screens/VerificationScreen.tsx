import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/stack';
import { colors, spacing, borderRadius } from '../theme/colors';
import { Card } from '../components/Card';
import { StatusBadge } from '../components/StatusBadge';
import { Button } from '../components/Button';
import { api, demoPassVerification } from '../services/api';
import { useStore } from '../store/useStore';
import { VerificationResult } from '../types';

type VerificationScreenProps = {
  route: RouteProp<{ params: { jobId: string } }, 'params'>;
  navigation: NativeStackNavigationProp<any>;
};

export const VerificationScreen: React.FC<VerificationScreenProps> = ({ route, navigation }) => {
  const { jobId } = route.params || {};
  const [verification, setVerification] = useState<VerificationResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [polling, setPolling] = useState(false);

  const currentJob = useStore((state) => state.currentJob);

  useEffect(() => {
    loadVerification();
  }, [jobId]);

  const loadVerification = async () => {
    try {
      const result = await api.getVerification(jobId);
      setVerification(result);
      
      if (result.status === 'pending') {
        setPolling(true);
      }
    } catch (error) {
      console.error('Failed to load verification:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoPass = async () => {
    await demoPassVerification(jobId);
    await loadVerification();
  };

  const handleReupload = () => {
    navigation.navigate('UploadProof', { jobId });
  };

  const goToEarnings = () => {
    navigation.navigate('Earnings');
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Checking verification status...</Text>
      </View>
    );
  }

  if (!verification) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Unable to load verification status</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Card style={styles.card}>
          <View style={styles.statusSection}>
            {verification.status === 'pending' && (
              <>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={styles.statusTitle}>Verification in Progress</Text>
                <Text style={styles.statusText}>
                  AI is analyzing your completion photos. This usually takes a few minutes.
                </Text>
              </>
            )}

            {verification.status === 'pass' && (
              <>
                <View style={styles.successIcon}>
                  <Ionicons name="checkmark-circle" size={64} color={colors.success} />
                </View>
                <Text style={styles.statusTitle}>Verification Passed!</Text>
                <Text style={styles.statusText}>
                  Your work has been verified. Payment will be processed shortly.
                </Text>
              </>
            )}

            {verification.status === 'fail' && (
              <>
                <View style={styles.errorIcon}>
                  <Ionicons name="close-circle" size={64} color={colors.error} />
                </View>
                <Text style={styles.statusTitle}>Verification Failed</Text>
                <Text style={styles.statusText}>
                  {verification.reason || 'The AI could not verify the completion. Please re-upload clearer photos.'}
                </Text>
              </>
            )}
          </View>
        </Card>

        {verification.status === 'pass' && verification.beforePhoto && verification.afterPhoto && (
          <Card style={styles.card}>
            <Text style={styles.sectionTitle}>Before & After</Text>
            <View style={styles.photoComparison}>
              <View style={styles.photoContainer}>
                <Text style={styles.photoLabel}>Before</Text>
                <Image source={{ uri: verification.beforePhoto }} style={styles.comparisonPhoto} />
              </View>
              <View style={styles.photoContainer}>
                <Text style={styles.photoLabel}>After</Text>
                <Image source={{ uri: verification.afterPhoto }} style={styles.comparisonPhoto} />
              </View>
            </View>
          </Card>
        )}

        {currentJob && (
          <Card style={styles.card}>
            <Text style={styles.sectionTitle}>Job Details</Text>
            <Text style={styles.jobTitle}>{currentJob.title}</Text>
            <View style={styles.jobDetails}>
              <Text style={styles.jobDetail}>
                Category: {currentJob.category}
              </Text>
              <Text style={styles.jobDetail}>
                Location: {currentJob.location.address}
              </Text>
            </View>
          </Card>
        )}

        {verification.status === 'pending' && (
          <Button
            title="Simulate Pass (Demo)"
            onPress={handleDemoPass}
            variant="outline"
            style={styles.demoButton}
          />
        )}

        {verification.status === 'pass' && (
          <Button
            title="View Earnings"
            onPress={goToEarnings}
            style={styles.actionButton}
          />
        )}

        {verification.status === 'fail' && (
          <>
            <Button
              title="Re-upload Photos"
              onPress={handleReupload}
              style={styles.actionButton}
            />
            <Button
              title="Contact Support"
              onPress={() => {}}
              variant="outline"
              style={styles.secondaryButton}
            />
          </>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    backgroundColor: colors.backgroundSecondary,
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
  errorText: {
    fontSize: 16,
    color: colors.error,
  },
  content: {
    padding: spacing.lg,
  },
  card: {
    marginBottom: spacing.lg,
  },
  statusSection: {
    alignItems: 'center',
    padding: spacing.xl,
  },
  successIcon: {
    marginBottom: spacing.lg,
  },
  errorIcon: {
    marginBottom: spacing.lg,
  },
  statusTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  statusText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.md,
  },
  photoComparison: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  photoContainer: {
    flex: 1,
  },
  photoLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  comparisonPhoto: {
    width: '100%',
    height: 150,
    borderRadius: borderRadius.md,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  jobDetails: {
    gap: spacing.sm,
  },
  jobDetail: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  demoButton: {
    minHeight: 56,
  },
  actionButton: {
    minHeight: 56,
  },
  secondaryButton: {
    minHeight: 56,
    marginTop: spacing.md,
  },
});