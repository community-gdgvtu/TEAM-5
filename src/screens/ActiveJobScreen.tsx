import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/stack';
import { colors, spacing, borderRadius } from '../theme/colors';
import { Card } from '../components/Card';
import { StatusBadge } from '../components/StatusBadge';
import { Button } from '../components/Button';
import { api, demoAwardBid } from '../services/api';
import { useStore } from '../store/useStore';
import { Bid } from '../types';

type ActiveJobScreenProps = {
  route: RouteProp<{ params: { bidId?: string } }, 'params'>;
  navigation: NativeStackNavigationProp<any>;
};

export const ActiveJobScreen: React.FC<ActiveJobScreenProps> = ({ route, navigation }) => {
  const { bidId } = route.params || {};
  const [activeBid, setActiveBid] = useState<Bid | null>(null);
  const [checklist, setChecklist] = useState({
    arrived: false,
    materials: false,
    started: false,
    completed: false,
  });
  const [loading, setLoading] = useState(true);

  const bids = useStore((state) => state.bids);

  const loadActiveJob = useCallback(() => {
    setLoading(true);
    // Find awarded bid
    const awardedBid = bids.find(b => b.status === 'Awarded');
    if (awardedBid) {
      setActiveBid(awardedBid);
    } else if (bidId) {
      // For demo: find by ID and award it
      const bid = bids.find(b => b.id === bidId);
      if (bid) {
        demoAwardBid(bidId).then(() => {
          const updatedBids = bids.map(b => b.id === bidId ? { ...b, status: 'Awarded' as const } : b);
          setActiveBid({ ...bid, status: 'Awarded' });
        });
      }
    }
    setLoading(false);
  }, [bidId, bids]);

  useEffect(() => {
    loadActiveJob();
  }, [loadActiveJob]);

  const toggleChecklistItem = (key: keyof typeof checklist) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleUploadProof = () => {
    const completedItems = Object.values(checklist).filter(Boolean).length;
    if (completedItems < 3) {
      Alert.alert(
        'Complete more tasks',
        'Please complete at least 3 checklist items before uploading proof.',
        [{ text: 'OK' }]
      );
      return;
    }
    navigation.navigate('UploadProof', { jobId: activeBid?.jobId });
  };

  const handleContact = () => {
    Alert.alert('Contact', 'Contact feature coming soon');
  };

  const openNavigation = () => {
    if (activeBid?.job?.location) {
      Alert.alert('Navigation', `Opening navigation to: ${activeBid.job.location.address}`);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.loadingText}>Loading active job...</Text>
      </View>
    );
  }

  if (!activeBid) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="hammer-outline" size={64} color={colors.textLight} />
        <Text style={styles.emptyTitle}>No Active Job</Text>
        <Text style={styles.emptyText}>
          You don't have any awarded jobs at the moment.
        </Text>
        <TouchableOpacity
          style={styles.emptyButton}
          onPress={() => navigation.navigate('Jobs')}
        >
          <Text style={styles.emptyButtonText}>Browse Jobs</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const job = activeBid.job;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Card style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.headerLeft}>
              <Text style={styles.title}>{job?.title || 'Active Job'}</Text>
              <Text style={styles.category}>{job?.category || 'General'}</Text>
            </View>
            <StatusBadge status={job?.status || 'In Progress'} />
          </View>

          <TouchableOpacity style={styles.locationRow} onPress={openNavigation}>
            <Ionicons name="navigate" size={20} color={colors.primary} />
            <Text style={styles.locationText}>{job?.location.address || 'Unknown location'}</Text>
            <Ionicons name="open-outline" size={20} color={colors.primary} />
          </TouchableOpacity>
        </Card>

        <Card style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="list" size={20} color={colors.primary} />
            <Text style={styles.cardTitle}>Job Checklist</Text>
          </View>

          <View style={styles.checklist}>
            <TouchableOpacity
              style={styles.checklistItem}
              onPress={() => toggleChecklistItem('arrived')}
            >
              <View style={[styles.checkbox, checklist.arrived && styles.checkboxChecked]}>
                {checklist.arrived && <Ionicons name="checkmark" size={16} color={colors.background} />}
              </View>
              <Text style={styles.checklistText}>Arrived on site</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.checklistItem}
              onPress={() => toggleChecklistItem('materials')}
            >
              <View style={[styles.checkbox, checklist.materials && styles.checkboxChecked]}>
                {checklist.materials && <Ionicons name="checkmark" size={16} color={colors.background} />}
              </View>
              <Text style={styles.checklistText}>Materials purchased</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.checklistItem}
              onPress={() => toggleChecklistItem('started')}
            >
              <View style={[styles.checkbox, checklist.started && styles.checkboxChecked]}>
                {checklist.started && <Ionicons name="checkmark" size={16} color={colors.background} />}
              </View>
              <Text style={styles.checklistText}>Work started</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.checklistItem}
              onPress={() => toggleChecklistItem('completed')}
            >
              <View style={[styles.checkbox, checklist.completed && styles.checkboxChecked]}>
                {checklist.completed && <Ionicons name="checkmark" size={16} color={colors.background} />}
              </View>
              <Text style={styles.checklistText}>Work completed</Text>
            </TouchableOpacity>
          </View>
        </Card>

        <Card style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="information-circle" size={20} color={colors.primary} />
            <Text style={styles.cardTitle}>Instructions</Text>
          </View>
          <Text style={styles.instructions}>
            Please complete the work according to the job description. Take clear "after" photos 
            from multiple angles to show the completed work. Ensure the site is clean and safe 
            before leaving.
          </Text>
        </Card>

        <Card style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="cash" size={20} color={colors.primary} />
            <Text style={styles.cardTitle}>Your Bid Details</Text>
          </View>
          <View style={styles.bidDetails}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Quote:</Text>
              <Text style={styles.detailValue}>
                {job?.aiEstimate.currency || '₹'}{activeBid.price.toLocaleString()}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>ETA:</Text>
              <Text style={styles.detailValue}>{activeBid.etaDays} days</Text>
            </View>
          </View>
        </Card>

        <Button
          title="Upload Completion Proof"
          onPress={handleUploadProof}
          style={styles.uploadButton}
          disabled={Object.values(checklist).filter(Boolean).length < 3}
        />

        <Button
          title="Contact Organization"
          onPress={handleContact}
          variant="outline"
          style={styles.contactButton}
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
  content: {
    padding: spacing.lg,
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
  headerLeft: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  category: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.md,
  },
  locationText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    marginHorizontal: spacing.sm,
  },
  checklist: {
    gap: spacing.md,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checklistText: {
    fontSize: 16,
    color: colors.text,
  },
  instructions: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 22,
  },
  bidDetails: {
    gap: spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  detailValue: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '600',
  },
  uploadButton: {
    minHeight: 56,
  },
  contactButton: {
    minHeight: 56,
    marginTop: spacing.md,
  },
});