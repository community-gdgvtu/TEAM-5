export const colors = {
  primary: '#F97316', // Orange accent
  primaryDark: '#EA580C',
  primaryLight: '#FDBA74',
  
  background: '#FFFFFF',
  backgroundSecondary: '#F3F4F6',
  backgroundTertiary: '#E5E7EB',
  
  text: '#1F2937',
  textSecondary: '#6B7280',
  textLight: '#9CA3AF',
  
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  
  border: '#E5E7EB',
  shadow: 'rgba(0, 0, 0, 0.1)',
  
  status: {
    open: '#3B82F6',
    pending: '#F59E0B',
    awarded: '#10B981',
    rejected: '#EF4444',
    inProgress: '#8B5CF6',
    submitted: '#06B6D4',
    verified: '#10B981',
    failed: '#EF4444',
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const shadows = {
  sm: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
};