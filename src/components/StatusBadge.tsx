import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, borderRadius, spacing } from '../theme/colors';

interface StatusBadgeProps {
  status: string;
  size?: 'small' | 'medium' | 'large';
}

const getStatusColor = (status: string): string => {
  const statusLower = status.toLowerCase();
  switch (statusLower) {
    case 'open':
      return colors.status.open;
    case 'pending':
      return colors.status.pending;
    case 'awarded':
      return colors.status.awarded;
    case 'rejected':
      return colors.status.rejected;
    case 'in progress':
      return colors.status.inProgress;
    case 'submitted':
      return colors.status.submitted;
    case 'verified':
    case 'pass':
      return colors.status.verified;
    case 'failed':
    case 'fail':
      return colors.status.failed;
    default:
      return colors.textSecondary;
  }
};

const getSizeStyles = (size: 'small' | 'medium' | 'large') => {
  switch (size) {
    case 'small':
      return { paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, fontSize: 10 };
    case 'large':
      return { paddingHorizontal: spacing.lg, paddingVertical: spacing.md, fontSize: 14 };
    default:
      return { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, fontSize: 12 };
  }
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'medium' }) => {
  const backgroundColor = getStatusColor(status);
  const sizeStyles = getSizeStyles(size);

  return (
    <View style={[styles.badge, { backgroundColor }]}>
      <Text style={[styles.text, { fontSize: sizeStyles.fontSize }]}>
        {status}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
  },
  text: {
    color: colors.background,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
});