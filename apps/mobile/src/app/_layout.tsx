import '@/styles/global.css';
import { ClerkLoaded, useSession } from '@clerk/clerk-expo';
import 'react-native-reanimated';

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Providers from './providers';

export default function RootLayout() {
  return (
    <Providers>
      <ClerkLoaded>
        <RootNavigator />
      </ClerkLoaded>
      <StatusBar style="auto" />
    </Providers>
  );
}

const RootNavigator = () => {
  const { isSignedIn, isLoaded } = useSession();

  console.log('isLoaded', isLoaded);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={isSignedIn ?? false}>
        <Stack.Screen name="(tabs)" />
      </Stack.Protected>
      <Stack.Protected guard={!isSignedIn}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>
    </Stack>
  );
};
