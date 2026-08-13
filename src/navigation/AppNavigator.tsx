import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { colors } from '../theme/colors';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { Tabs } from './Tabs';
import { JobDetailScreen } from '../screens/JobDetailScreen';
import { SubmitBidScreen } from '../screens/SubmitBidScreen';
import { UploadProofScreen } from '../screens/UploadProofScreen';
import { VerificationScreen } from '../screens/VerificationScreen';
import { RatingsScreen } from '../screens/RatingsScreen';

const Stack = createStackNavigator();

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.background,
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
          },
          headerTintColor: colors.text,
          headerTitleStyle: {
            fontWeight: '600',
          },
        }}
      >
        <Stack.Screen 
          name="Onboarding" 
          component={OnboardingScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="MainTabs" 
          component={Tabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="JobDetail" 
          component={JobDetailScreen}
          options={{ title: 'Job Details' }}
        />
        <Stack.Screen 
          name="SubmitBid" 
          component={SubmitBidScreen}
          options={{ title: 'Submit Your Bid' }}
        />
        <Stack.Screen 
          name="UploadProof" 
          component={UploadProofScreen}
          options={{ title: 'Upload Completion Proof' }}
        />
        <Stack.Screen 
          name="Verification" 
          component={VerificationScreen}
          options={{ title: 'AI Verification' }}
        />
        <Stack.Screen 
          name="Ratings" 
          component={RatingsScreen}
          options={{ title: 'Ratings & Reviews' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};