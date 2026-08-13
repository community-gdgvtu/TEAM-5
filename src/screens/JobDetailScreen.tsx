import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/stack';
import { colors, spacing, borderRadius } from '../theme/colors';
import { Card } from '../components/Card';
import { StatusBadge } from '../components/StatusBadge';
import { Button } from '../components/Button';
import { api } from '../services/api';
import { useStore } from '../store/useStore';
import { Job } from '../types';

type JobDetailScreenProps = {
  route: RouteProp<{ params: { jobId: string } }, 'params'>;
  navigation: NativeStackNavigationProp<any>;
};

export const JobDetailScreen: React.FC<JobDetailScreenProps> = ({ route, navigation }) => {
  const { jobId } = route.params || {};
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const setCurrentJob = useStore((state) => state.setCurrentJob);

  useEffect(() => {
    loadJob();
  }, [jobId]);

  const loadJob = async () => {
    try {
      const data = await api.getJob(jobId);
      setJob(data);
      setCurrentJob(data);
    } catch (error) {
      console.error('Failed to load job:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBidPress = () => {
    navigation.navigate('SubmitBid', { jobId });
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const openMaps = () => {
    // In a real app, this would open Google Maps or Apple Maps
    console.log('Opening maps for:', job?.location.address);
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!job) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Failed to load job details</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageGallery}>
        <Image source={{ uri: job.photos[currentImageIndex] } || { uri: 'https://via.placeholder.com/400x300' }} style={styles.mainImage} />
        {job.photos.length > 1 && (
          <View style={styles.imageDots}>
            {job.photos.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  index === currentImageIndex && styles.dotActive,
                ]}
              />
            ))}
          </View>
        )}
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.title}>{job.title}</Text>
            <Text style={styles.category}>{job.category}</Text>
          </View>
          <StatusBadge status={job.status} />
        </View>

        <Card style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="location" size={20} color={colors.primary} />
            <Text style={styles.cardTitle}>Location</Text>
          </View>
          <TouchableOpacity onPress={openMaps} style={styles.locationRow}>
            <Text style={styles.address}>{job.location.address}</Text>
            <Ionicons name="open-outline" size={20} color={colors.primary} />
          </TouchableOpacity>
        </Card>

        <Card style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="document-text" size={20} color={colors.primary} />
            <Text style={styles.cardTitle}>Description</Text>
          </View>
          <Text style={styles.description}>{job.description}</Text>
        </Card>

        <Card style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="business" size={20} color={colors.primary} />
            <Text style={styles.cardTitle}>Organization</Text>
          </View>
          <Text style={styles.orgName}>{job.orgName}</Text>
        </Card>

        <Card style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="cash" size={20} color={colors.primary} />
            <Text style={styles.cardTitle}>AI Cost Estimate</Text>
          </View>
          <View style={styles.estimateSection}>
            <Text style={styles.estimateAmount}>
              {job.aiEstimate.currency}{job.aiEstimate.min.toLocaleString()} - {job.aiEstimate.currency}{job.aiEstimate.max.toLocaleString()}
            </Text>
            <Text style={styles.estimateNote}>
              This is an AI-estimated range for reference. Final price may vary based on your bid.
            </Text>
          </View>
        </Card>

        <Card style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="wallet" size={20} color={colors.primary} />
            <Text style={styles.cardTitle}>Funding Status</Text>
          </View>
          <View style={styles.fundingSection}>
            <View style={styles.fundingBar}>
              <View style={styles.fundingBackground}>
                <View style={[styles.fundingProgress, { width: `${job.fundingProgress}%` }]} />
              </View>
            </View>
            <View style={styles.fundingInfo}>
              <Text style={styles.fundingPercent}>{job.fundingProgress}% funded</Text>
              <Text style={styles.fundingNote}>
                {job.fundingProgress < 100 ? 'Funding in progress' : 'Fully funded'}
              </Text>
            </View>
          </View>
        </Card>

        <Card style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="people" size={20} color={colors.primary} />
            <Text style={styles.cardTitle}>Bids Received</Text>
          </View>
          <View style={styles.bidsSection}>
            <Text style={styles.bidCount}>{job.bidCount}</Text>
            <Text style={styles.bidLabel}>bids submitted</Text>
          </View>
        </Card>

        <Card style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="time" size={20} color={colors.primary} />
            <Text style={styles.cardTitle}>Posted</Text>
          </View>
          <Text style={styles.postedTime}>{getTimeAgo(job.postedAt)}</Text>
        </Card>

        <View style={styles.footer}>
          <Button
            title="Submit Your Bid"
            onPress={handleBidPress}
            style={styles.bidButton}
            disabled={job.status !== 'Open'}
          />
        </View>
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
    backgroundColor: colors.backgroundSecondary,
  },
  errorText: {
    fontSize: 16,
    color: colors.error,
  },
  imageGallery: {
    position: 'relative',
  },
  mainImage: {
    width: '100%',
    height: 250,
  },
  imageDots: {
    position: 'absolute',
    bottom: spacing.md,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.background,
    opacity: 0.5,
  },
  dotActive: {
    opacity: 1,
    backgroundColor: colors.primary,
  },
  content: {
    padding: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  headerLeft: {
    flex: 1,
    marginRight: spacing.md,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  category: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  card: {
    marginBottom: spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  locationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  address: {
    fontSize: 14,
    color: colors.textSecondary,
    flex: 1,
  },
  description: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 22,
  },
  orgName: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  estimateSection: {
    gap: spacing.sm,
  },
  estimateAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
  },
  estimateNote: {
    fontSize: 12,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  fundingSection: {
    gap: spacing.sm,
  },
  fundingBar: {
    height: 8,
    backgroundColor: colors.backgroundTertiary,
    borderRadius: 4,
    overflow: 'hidden',
  },
  fundingBackground: {
    height: '100%',
    backgroundColor: colors.backgroundTertiary,
  },
  fundingProgress: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  fundingInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fundingPercent: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  fundingNote: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  bidsSection: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: spacing.sm,
  },
  bidCount: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.primary,
  },
  bidLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  postedTime: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  footer: {
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
  bidButton: {
    minHeight: 56,
  },
});