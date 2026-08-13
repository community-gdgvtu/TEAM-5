import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius } from '../theme/colors';
import { Card } from '../components/Card';
import { api } from '../services/api';
import { useStore } from '../store/useStore';
import { Review } from '../types';

export const RatingsScreen = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [average, setAverage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const setReviewsInStore = useStore((state) => state.setReviews);

  const loadReviews = useCallback(async () => {
    try {
      const data = await api.getWorkerRatings('worker1');
      setReviews(data.reviews);
      setAverage(data.average);
      setReviewsInStore(data.reviews);
    } catch (error) {
      console.error('Failed to load reviews:', error);
    } finally {
      setLoading(false);
    }
  }, [setReviewsInStore]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadReviews();
    setRefreshing(false);
  }, [loadReviews]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Ionicons
        key={i}
        name={i < rating ? 'star' : 'star-outline'}
        size={16}
        color={i < rating ? colors.warning : colors.textLight}
      />
    ));
  };

  const getDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.loadingText}>Loading reviews...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Ratings & Reviews</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
        }
      >
        <Card style={styles.summaryCard}>
          <View style={styles.summaryContent}>
            <View style={styles.ratingContainer}>
              <Text style={styles.averageRating}>{average.toFixed(1)}</Text>
              <View style={styles.stars}>{renderStars(Math.round(average))}</View>
              <Text style={styles.reviewCount}>{reviews.length} review{reviews.length !== 1 ? 's' : ''}</Text>
            </View>
          </View>
        </Card>

        {reviews.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="star-outline" size={64} color={colors.textLight} />
            <Text style={styles.emptyTitle}>No reviews yet</Text>
            <Text style={styles.emptyText}>
              Complete jobs to receive reviews from organizations
            </Text>
          </View>
        ) : (
          reviews.map((review) => (
            <Card key={review.id} style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <View style={styles.reviewerInfo}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                      {review.from.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.reviewerDetails}>
                    <Text style={styles.reviewerName}>{review.from}</Text>
                    <Text style={styles.reviewDate}>{getDate(review.date)}</Text>
                  </View>
                </View>
                <View style={styles.reviewStars}>{renderStars(review.rating)}</View>
              </View>

              <Text style={styles.jobReference}>{review.jobTitle}</Text>

              <Text style={styles.reviewComment}>{review.comment}</Text>
            </Card>
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
  summaryCard: {
    alignItems: 'center',
    padding: spacing.xl,
  },
  summaryContent: {
    alignItems: 'center',
  },
  ratingContainer: {
    alignItems: 'center',
  },
  averageRating: {
    fontSize: 48,
    fontWeight: '700',
    color: colors.text,
  },
  stars: {
    flexDirection: 'row',
    gap: 4,
    marginVertical: spacing.sm,
  },
  reviewCount: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  emptyState: {
    alignItems: 'center',
    padding: spacing.xl,
    minHeight: 300,
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
  reviewCard: {
    marginBottom: 0,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  reviewerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.background,
  },
  reviewerDetails: {
    gap: 2,
  },
  reviewerName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  reviewDate: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  reviewStars: {
    flexDirection: 'row',
    gap: 2,
  },
  jobReference: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    fontStyle: 'italic',
  },
  reviewComment: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 22,
  },
});