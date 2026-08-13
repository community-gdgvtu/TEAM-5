import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { JobFeedScreen } from '../screens/JobFeedScreen';
import { MyBidsScreen } from '../screens/MyBidsScreen';
import { ActiveJobScreen } from '../screens/ActiveJobScreen';
import { EarningsScreen } from '../screens/EarningsScreen';
import { RatingsScreen } from '../screens/RatingsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

export const Tabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case 'Jobs':
              iconName = focused ? 'list' : 'list-outline';
              break;
            case 'MyBids':
              iconName = focused ? 'document-text' : 'document-text-outline';
              break;
            case 'ActiveJob':
              iconName = focused ? 'hammer' : 'hammer-outline';
              break;
            case 'Earnings':
              iconName = focused ? 'wallet' : 'wallet-outline';
              break;
            case 'Ratings':
              iconName = focused ? 'star' : 'star-outline';
              break;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
            default:
              iconName = 'ellipse';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        headerShown: false,
        tabBarStyle: {
          paddingBottom: 8,
          paddingTop: 8,
          height: 60,
        },
      })}
    >
      <Tab.Screen name="Jobs" component={JobFeedScreen} options={{ tabBarLabel: 'Jobs Feed' }} />
      <Tab.Screen name="MyBids" component={MyBidsScreen} options={{ tabBarLabel: 'My Bids' }} />
      <Tab.Screen name="ActiveJob" component={ActiveJobScreen} options={{ tabBarLabel: 'Active Job' }} />
      <Tab.Screen name="Earnings" component={EarningsScreen} options={{ tabBarLabel: 'Earnings' }} />
      <Tab.Screen name="Ratings" component={RatingsScreen} options={{ tabBarLabel: 'Ratings' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: 'Profile' }} />
    </Tab.Navigator>
  );
};