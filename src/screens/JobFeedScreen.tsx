import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '../theme/colors';
import { Card } from '../components/Card';
import { StatusBadge } from '../components/StatusBadge';
import { api } from '../services/api';
import { useStore } from '../store/useStore';
import { Job } from '../types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type JobFeedScreenProps = {
  navigation: NativeStackNavigationProp<any>;
};

export const JobFeedScreen: React.FC<JobFeedScreenProps> = ({ navigation }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [filter, setFilter] = useState<'all' | 'distance' | 'payout' | 'category'>('all');
  
  const setJobsInStore = useStore((state) => state.setJobs);

  const loadJobs = useCallback(async () => {
    try {
      const data = await api.getJobs('open');
      setJobs(data);
      setJobsInStore(data);
    } catch (error) {
      console.error('Failed to load jobs:', error);
    } finally {
      setLoading(false);
    }
  }, [setJobsInStore]);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadJobs();
    setRefreshing(false);
  }, [loadJobs]);

  const getFilteredJobs = () => {
    let filtered = [...jobs];
    
    switch (filter) {
      case 'distance':
        filtered.sort((a, b) => (a.distance || 0) - (b.distance || 0));
        break;
      case 'payout':
        filtered.sort((a, b) => b.aiEstimate.max - a.aiEstimate.max);
        break;
      case 'category':
        filtered.sort((a, b) => a.category.localeCompare(b.category));
        break;
    }
    
    return filtered;
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

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: keyof typeof Ionicons.glyphMap } = {
      Electrician: 'flash',
      Plumber: 'water',
      Mason: 'cube',
      Carpenter: 'hammer',
      Painter: 'brush',
      Gardener: 'leaf',
      'General Labor': 'construct',
      Welder: 'flame',
      HVAC: 'thermometer',
      Roofer: 'home',
    };
    return icons[category] || 'briefcase';
  };

  const renderJobCard = (job: Job) => (
    <TouchableOpacity
      key={job.id}
      onPress={() => navigation.navigate('JobDetail', { jobId: job.id })}
      activeOpacity={0.7}
    >
      <Card style={styles.jobCard}>
        <View style={styles.cardHeader}>
          <View style={styles.categoryIcon}>
            <Ionicons name={getCategoryIcon(job.category)} size={24} color={colors.primary} />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.jobTitle} numberOfLines={1}>
              {job.title}
            </Text>
            <Text style={styles.category}>{job.category}</Text>
          </View>
          <StatusBadge status={job.status} size="small" />
        </View>

        <Image source={{ uri: job.photos[0] }} style={styles.jobImage} />

        <View style={styles.cardDetails}>
          <View style={styles.detailRow}>
            <Ionicons name="location" size={16} color={colors.textSecondary} />
            <Text style={styles.detailText}>
              {job.distance ? `${job.distance.toFixed(1)} km away` : job.location.address}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="time" size={16} color={colors.textSecondary} />
            <Text style={styles.detailText}>{getTimeAgo(job.postedAt)}</Text>
          </View>
        </View>

        <View style={styles.payoutSection}>
          <Text style={styles.payoutLabel}>AI Estimate</Text>
          <Text style={styles.payoutAmount}>
            {job.aiEstimate.currency}{job.aiEstimate.min.toLocaleString()} - {job.aiEstimate.currency}{job.aiEstimate.max.toLocaleString()}
          </Text>
        </View>

        <View style={styles.footer}>
          <View style={styles.bidInfo}>
            <Ionicons name="people" size={16} color={colors.textSecondary} />
            <Text style={styles.bidCount}>{job.bidCount} bids</Text>
          </View>
          <View style={styles.fundingBar}>
            <View style={styles.fundingBackground}>
              <View style={[styles.fundingProgress, { width: `${job.fundingProgress}%` }]} />
            </View>
            <Text style={styles.fundingText}>{job.fundingProgress}% funded</Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.loadingText}>Loading jobs...</Text>
      </View>
    );
  }

  const filteredJobs = getFilteredJobs();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Available Jobs</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={[styles.viewToggle, viewMode === 'list' && styles.viewToggleActive]}
            onPress={() => setViewMode('list')}
          >
            <Ionicons name="list" size={20} color={viewMode === 'list' ? colors.primary : colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.viewToggle, viewMode === 'map' && styles.viewToggleActive]}
            onPress={() => setViewMode('map')}
          >
            <Ionicons name="map" size={20} color={viewMode === 'map' ? colors.primary : colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.filterBar}>
        {(['all', 'distance', 'payout', 'category'] as const).map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterChip, filter === f && styles.filterChipActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {viewMode === 'map' ? (
        <View style={styles.mapPlaceholder}>
          <Ionicons name="map" size={64} color={colors.textLight} />
          <Text style={styles.mapPlaceholderText}>Map view coming soon</Text>
          <TouchableOpacity onPress={() => setViewMode('list')}>
            <Text style={styles.mapPlaceholderLink}>Switch to list view</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
          }
        >
          {filteredJobs.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="briefcase-outline" size={64} color={colors.textLight} />
              <Text style={styles.emptyTitle}>No jobs available</Text>
              <Text style={styles.emptyText}>
                There are no open jobs in your area right now. Check back later!
              </Text>
            </View>
          ) : (
            filteredJobs.map(renderJobCard)
          )}
        </ScrollView>
      )}
    </View>
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
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  headerActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  viewToggle: {
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: colors.backgroundSecondary,
  },
  viewToggleActive: {
    backgroundColor: colors.primaryLight,
  },
  filterBar: {
    flexDirection: 'row',
    padding: spacing.md,
    gap: spacing.sm,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filterChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.backgroundSecondary,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
  },
  filterText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  filterTextActive: {
    color: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  jobCard: {
    marginBottom: 0,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  headerText: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  category: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  jobImage: {
    width: '100%',
    height: 150,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
  },
  cardDetails: {
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  detailText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  payoutSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: spacing.md,
  },
  payoutLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  payoutAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bidInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  bidCount: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  fundingBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  fundingBackground: {
    width: 80,
    height: 6,
    backgroundColor: colors.backgroundTertiary,
    borderRadius: 3,
    overflow: 'hidden',
  },
  fundingProgress: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  fundingText: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  mapPlaceholderText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
  mapPlaceholderLink: {
    fontSize: 14,
    color: colors.primary,
    marginTop: spacing.sm,
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    minHeight: 400,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginTop: spacing.lg,
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
});