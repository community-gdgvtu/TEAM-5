import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native';
import { colors, spacing, borderRadius } from '../theme/colors';
import { Card } from '../components/Card';
import { StatusBadge } from '../components/StatusBadge';
import { api } from '../services/api';
import { useStore } from '../store/useStore';
import { Bid } from '../types';

type MyBidsScreenProps = {
  navigation: NativeStackNavigationProp<any>;
};

export const MyBidsScreen: React.FC<MyBidsScreenProps> = ({ navigation }) => {
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  const setBidsInStore = useStore((state) => state.setBids);

  const loadBids = useCallback(async () => {
    try {
      const data = await api.getWorkerBids('worker1');
      setBids(data);
      setBidsInStore(data);
    } catch (error) {
      console.error('Failed to load bids:', error);
    } finally {
      setLoading(false);
    }
  }, [setBidsInStore]);

  useEffect(() => {
    loadBids();
  }, [loadBids]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadBids();
    setRefreshing(false);
  }, [loadBids]);

  const handleBidPress = (bid: Bid) => {
    if (bid.status === 'Pending') {
      navigation.navigate('JobDetail', { jobId: bid.jobId });
    } else if (bid.status === 'Awarded') {
      navigation.navigate('MainTabs', { screen: 'ActiveJob' });
    }
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

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.loadingText}>Loading your bids...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Bids</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
        }
      >
        {bids.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={64} color={colors.textLight} />
            <Text style={styles.emptyTitle}>No bids yet</Text>
            <Text style={styles.emptyText}>
              Start bidding on jobs to track your proposals here
            </Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => navigation.navigate('Jobs')}
            >
              <Text style={styles.emptyButtonText}>Browse Jobs</Text>
            </TouchableOpacity>
          </View>
        ) : (
          bids.map((bid) => (
            <TouchableOpacity
              key={bid.id}
              onPress={() => handleBidPress(bid)}
              activeOpacity={0.7}
              disabled={bid.status === 'Rejected'}
            >
              <Card style={styles.bidCard}>
                <View style={styles.cardHeader}>
                  <View style={styles.headerLeft}>
                    <Text style={styles.jobTitle} numberOfLines={1}>
                      {bid.job?.title || 'Unknown Job'}
                    </Text>
                    <Text style={styles.jobCategory}>
                      {bid.job?.category || 'General'}
                    </Text>
                  </View>
                  <StatusBadge status={bid.status} />
                </View>

                <View style={styles.bidDetails}>
                  <View style={styles.detailRow}>
                    <Ionicons name="cash" size={16} color={colors.textSecondary} />
                    <Text style={styles.detailText}>
                      {bid.job?.aiEstimate.currency || '₹'}{bid.price.toLocaleString()}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Ionicons name="time" size={16} color={colors.textSecondary} />
                    <Text style={styles.detailText}>{bid.etaDays} days</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Ionicons name="calendar" size={16} color={colors.textSecondary} />
                    <Text style={styles.detailText}>{getTimeAgo(bid.submittedAt)}</Text>
                  </View>
                </View>

                {bid.note && (
                  <View style={styles.noteSection}>
                    <Text style={styles.noteLabel} numberOfLines={1}>
                      {bid.note}
                    </Text>
                  </View>
                )}

                {bid.status === 'Awarded' && (
                  <View style={styles.awardedBadge}>
                    <Ionicons name="checkmark-circle" size={16} color={colors.success} />
                    <Text style={styles.awardedText}>Job awarded! Start working</Text>
                  </View>
                )}

                {bid.status === 'Rejected' && (
                  <View style={styles.rejectedBadge}>
                    <Ionicons name="close-circle" size={16} color={colors.error} />
                    <Text style={styles.rejectedText}>Bid was not selected</Text>
                  </View>
                )}
              </Card>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  bidCard: {
    marginBottom: 0,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  headerLeft: {
    flex: 1,
    marginRight: spacing.md,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  jobCategory: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  bidDetails: {
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
  noteSection: {
    padding: spacing.md,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
  },
  noteLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  awardedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    backgroundColor: `${colors.success}15`,
    borderRadius: borderRadius.md,
  },
  awardedText: {
    fontSize: 12,
    color: colors.success,
    fontWeight: '500',
  },
  rejectedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    backgroundColor: `${colors.error}15`,
    borderRadius: borderRadius.md,
  },
  rejectedText: {
    fontSize: 12,
    color: colors.error,
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
    marginBottom: spacing.lg,
  },
  emptyButton: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
  },
  emptyButtonText: {
    color: colors.background,
    fontWeight: '600',
  },
});